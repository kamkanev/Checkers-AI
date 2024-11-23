class RandomAgent {
    constructor() {
        
    }

    chooseAction(actions){

        return actions[Math.floor(Math.random() * actions.length)];
        
    }
}