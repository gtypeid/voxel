

var dBT = 
{
    bt_Air: 0,
    bt_Grass : 1,
    bt_Dirt : 2,
    bt_Stone : 3,
    bt_Wood : 4,
    bt_Sand : 5,
    bt_Water : 6,
}
class block
{
    constructor()
    {
        this._mbActive = false;
        this._mType = dBT;
    }

}


export default block;