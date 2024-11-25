class QLearing {
    constructor() {
        this.qTable = {};
        this.learingRate = 0.1;
        this.explorationRate = 1;
        this.explorationDecay = 0.99;
        this.discountFactor = 0.3;
    }

    chooseAction(state, actions){

        if(Math.random() < this.explorationRate){
            return actions[Math.floor(Math.random() * actions.length)];
        }
        if(!this.qTable[state]){
            this.qTable[state] = [];
        }
        var takenAction = actions[0];
        var bestQValue = this.qTable[state][takenAction] || 0;
        //console.log(bestQValue);
        //console.log(this.qTable[state]);
        

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
            this.qTable[state] = [];
        }
        if(!this.qTable[newState]){
            this.qTable[newState] = [];
        }

        var currQValue = this.qTable[state][action] || 0;
        var maxFutureQValue = 0; //Math.max(...Object.values(this.qTable[newState]));
        //console.log(this.qTable[newState]);
        
            for(var act in this.qTable[newState]){
                if(this.qTable[newState][act] > maxFutureQValue){
                    maxFutureQValue = this.qTable[newState][act];
                }
                
            }
        //console.log(maxFutureQValue, currQValue);
        
        var newQValue = currQValue + this.learingRate * (reward + maxFutureQValue * this.discountFactor - currQValue);
        this.qTable[state][action] = newQValue;
        
        if(this.explorationRate > 0.01){
            this.explorationRate *= this.explorationDecay;
        }
        

    }
}