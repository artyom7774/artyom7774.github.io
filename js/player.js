class Player{
    constructor(){
        this.max_health = 10;
        this.health = 10;
    
        this.damage = 4;
    
        this.level = 1;
        this.max_xp = 10;
        this.xp = 0;
    }
    
    new(){
        if (this.xp >= this.max_xp){
            this.xp -= this.max_xp;
            this.max_xp += Math.round(Math.sqrt(this.max_xp)) + 2;
        }
    }
}
    
var player = new Player();
