class RandomAgent {
    constructor() {
        
    }

    chooseAction(state, actions){

        return actions[Math.floor(Math.random() * actions.length)];
        
    }
}