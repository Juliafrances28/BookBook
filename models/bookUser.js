module.exports = function (sequelize, Datatypes) {
    var User = sequelize.define("User", {
        email: {
            type: Datatypes.STRING,
            allowNull: false,
            isEmail: true
        },
        password: {
            type: Datatypes.STRING,
            allowNull: false,
            validate: {
                len: [1]
            }
        }
    });

    return User;




};