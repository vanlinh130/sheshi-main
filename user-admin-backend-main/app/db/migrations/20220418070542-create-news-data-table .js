module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.createTable('news', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      title: {
        type: Sequelize.STRING
      },
      nameNews: {
        type: Sequelize.STRING
      },
      description: {
        type: Sequelize.STRING
      },
      descriptionSEO: {
        type: Sequelize.STRING
      },
      slug: {
        type: Sequelize.STRING
      },
      thumbnail: {
        type: Sequelize.TEXT
      },
      content: {
        type: Sequelize.TEXT
      },
      status: {
        type: Sequelize.TINYINT(1)
      },
      outstanding: {
        type: Sequelize.TINYINT(1)
      },
      createdById: {
        type: Sequelize.STRING
      },
      updatedById: {
        type: Sequelize.STRING
      },
      createdAt: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.fn('NOW')
      },
      updatedAt: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.fn('NOW')
      }
    });
  },

  async down (queryInterface) {
    return queryInterface.dropTable('news');
  }
};
