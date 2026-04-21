import db from './db.js';
import Logger from './logger.js';

const logger = new Logger('Seed');

const defaultCategoriesData = [
  { name: '工作', icon: 'Briefcase', color: '#3b82f6', suffix: 'work' },
  { name: '个人', icon: 'User', color: '#10b981', suffix: 'personal' },
  { name: '购物', icon: 'ShoppingCart', color: '#f59e0b', suffix: 'shopping' },
  { name: '健康', icon: 'Heart', color: '#ef4444', suffix: 'health' },
  { name: '学习', icon: 'BookOpen', color: '#8b5cf6', suffix: 'study' },
  { name: '生活', icon: 'Home', color: '#ec4899', suffix: 'home' },
  { name: '健身', icon: 'Dumbbell', color: '#059669', suffix: 'fitness' },
  { name: '咖啡', icon: 'Coffee', color: '#b45309', suffix: 'coffee' },
  { name: '音乐', icon: 'Music', color: '#f472b6', suffix: 'music' },
  { name: '旅行', icon: 'Plane', color: '#0ea5e9', suffix: 'travel' },
  { name: '摄影', icon: 'Camera', color: '#4b5563', suffix: 'photo' },
  { name: '代码', icon: 'Code', color: '#1e293b', suffix: 'code' },
  { name: '创意', icon: 'Palette', color: '#a855f7', suffix: 'design' },
  { name: '游戏', icon: 'Gamepad2', color: '#f97316', suffix: 'gaming' },
  { name: '餐饮', icon: 'Utensils', color: '#84cc16', suffix: 'food' },
  { name: '交通', icon: 'Car', color: '#6366f1', suffix: 'transport' },
  { name: '考试', icon: 'GraduationCap', color: '#ef4444', suffix: 'exam' },
  { name: '医疗', icon: 'Stethoscope', color: '#10b981', suffix: 'medical' },
];

async function seed() {
  logger.info('Starting database seed...');

  try {
    const users = db.prepare('SELECT id FROM users').all() as { id: string }[];
    logger.info(`Found ${users.length} users`);

    const insertStmt = db.prepare(
      'INSERT OR IGNORE INTO categories (id, name, icon, color, userId) VALUES (?, ?, ?, ?, ?)'
    );

    let totalInserted = 0;

    const transaction = db.transaction(() => {
      for (const user of users) {
        const userId = user.id;
        for (const cat of defaultCategoriesData) {
          const categoryId = userId === 'demo-user' ? cat.suffix : `${userId}-${cat.suffix}`;
          const result = insertStmt.run(categoryId, cat.name, cat.icon, cat.color, userId);
          if (result.changes > 0) {
            totalInserted++;
          }
        }
      }
    });

    transaction();
    logger.info(`Seed completed successfully! Inserted ${totalInserted} new categories.`);
  } catch (error) {
    logger.error('Seed failed', { error });
    process.exit(1);
  }
}

seed();
