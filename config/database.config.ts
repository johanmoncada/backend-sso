export default {
  type: 'mariadb', // Cambia a 'postgres' si lo prefieres
  database: 'database.mariadb',
  synchronize: true,
  entities: ['src/**/*.entity.ts'],
};
