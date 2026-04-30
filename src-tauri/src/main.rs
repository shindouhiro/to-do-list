#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use std::fs;
use std::net::SocketAddr;
use std::sync::{mpsc, Mutex};
use std::time::Duration;

use gtd_desktop::backend::{self, BackendConfig, RunMode};
use tauri::Manager;
use tokio::sync::oneshot;

struct BackendState {
    shutdown: Mutex<Option<oneshot::Sender<()>>>,
    port: Mutex<u16>,
}

fn stop_backend(app: &tauri::AppHandle) {
    let state = app.state::<BackendState>();
    let shutdown = {
        let mut guard = state.shutdown.lock().expect("backend mutex poisoned");
        guard.take()
    };

    if let Some(sender) = shutdown {
        let _ = sender.send(());
    }
}

fn inject_runtime(window: &tauri::Window, addr: SocketAddr) {
    let api_url = format!("http://{}/api", addr);
    let script = format!(
        "window.__GTD_DESKTOP__ = true; window.__TAURI_API_URL__ = '{}';",
        api_url
    );
    let _ = window.eval(&script);
}

fn main() {
    tauri::Builder::default()
        .manage(BackendState {
            shutdown: Mutex::new(None),
            port: Mutex::new(0),
        })
        .on_page_load(|window, _| {
            let state = window.state::<BackendState>();
            let port = *state.port.lock().expect("backend mutex poisoned");
            if port != 0 {
                inject_runtime(&window, SocketAddr::from(([127, 0, 0, 1], port)));
            }
        })
        .setup(|app| {
            let app_data_dir = app
                .path_resolver()
                .app_data_dir()
                .ok_or_else(|| "无法定位应用数据目录".to_string())?;
            fs::create_dir_all(&app_data_dir)
                .map_err(|e| format!("无法创建应用数据目录 {}: {e}", app_data_dir.display()))?;

            let config = BackendConfig {
                host: "127.0.0.1".to_string(),
                port: 0,
                db_path: app_data_dir.join("todo.db"),
                mode: RunMode::Desktop,
                static_dir: None,
                jwt_secret: "desktop-local-secret".to_string(),
            };

            let (ready_tx, ready_rx) = mpsc::channel();
            let (shutdown_tx, shutdown_rx) = oneshot::channel();
            tauri::async_runtime::spawn(async move {
                if let Err(error) = backend::serve(config, Some(ready_tx), shutdown_rx).await {
                    eprintln!("Backend server failed: {error}");
                }
            });

            let addr = match ready_rx.recv_timeout(Duration::from_secs(15)) {
                Ok(Ok(addr)) => addr,
                Ok(Err(error)) => {
                    let _ = tauri::api::dialog::message::<tauri::Wry>(
                        None,
                        "启动失败",
                        format!("后端服务启动失败: {error}\n请检查磁盘空间或权限。"),
                    );
                    return Err(error.into());
                }
                Err(_) => {
                    let _ = tauri::api::dialog::message::<tauri::Wry>(
                        None,
                        "启动超时",
                        "内置后端服务启动超时，请尝试重新启动应用。",
                    );
                    return Err("内置后端启动超时".into());
                }
            };

            {
                let state = app.state::<BackendState>();
                *state.port.lock().expect("backend mutex poisoned") = addr.port();
                *state.shutdown.lock().expect("backend mutex poisoned") = Some(shutdown_tx);
            }

            if let Some(window) = app.get_window("main") {
                inject_runtime(&window, addr);
            }

            Ok(())
        })
        .build(tauri::generate_context!())
        .expect("error while running tauri application")
        .run(|app, event| {
            if matches!(
                event,
                tauri::RunEvent::Exit | tauri::RunEvent::ExitRequested { .. }
            ) {
                stop_backend(app);
            }
        });
}
