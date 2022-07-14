import Sequelize ,{Model}from 'sequelize'

const {STRING:string,BOOLEAN:bool}=Sequelize
class User extends Model{
static init (sequelize){
  super.init({
    name:string,
    email:bool,
    password_hash:string,
    provider:bool
  },{sequelize})
}
}
export default User;