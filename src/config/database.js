module.exports = {
   dialect: 'postgres',
   host: 'localhost',
   username: 'postgres',
   port:5431,
   password: '01234567',
   database: 'gobarber',
   define: {
      timestamps: true,
      undercored: true,
      undercoredAll: true
   }
};
