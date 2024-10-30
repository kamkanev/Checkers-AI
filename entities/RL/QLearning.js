class QLearing {
    constructor() {
        this.qTable = {};
        this.learingRate = 0.1;
        this.explorationRate = 1.0;
        this.explorationDecay = 0.99;
        this.changingFactor = 0.3;
    }

    chooseAction(state, actions){

        if(Math.random() < this.explorationRate){
            return actions[Math.floor(Math.random() * actions.length)];
        }
        if(!this.qTable[state]){
            this.qTable[state] = {};
        }
        var takenAction = actions[0];
        var bestQValue = this.qTable[state][takenAction] || 0;

        actions.forEach(action => {
            var qValue = this.qTable[state][action] || 0;
            if(qValue > bestQValue){
                bestQValue = qValue;
                takenAction = action;
            }
        });

        return takenAction;

    }

    updateQValue(state, newState, action, reward){

        if(!this.qTable[state]){
            this.qTable[state] = {};
        }
        if(!this.qTable[newState]){
            this.qTable[newState] = {};
        }

        var currQValue = this.qTable[state][action] || 0;
        var maxFutureQValue = Math.max(...Object.values(this.qTable[newState]));
        var newQValue = currQValue + this.learingRate * (reward + maxFutureQValue * this.changingFactor - currQValue);
        this.qTable[state][action] = newQValue;

        this.explorationRate *= this.explorationRate;

    }
}