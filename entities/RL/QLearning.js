class QLearing {
    constructor(learningRate = 0.1, discountFactor = 0.7, epsilon = 1, epsilonMin = 0.1, epsilonDicay = 0.995) {
        this.qTable = {};
        this.learingRate = learningRate;
        this.explorationRate = epsilon;
        this.explorationDecay = epsilonDicay;
        this.discountFactor = discountFactor;
        this.epsilonMin = epsilonMin
    }

    //TODO: implement off policy learning

    chooseAction(state, actions){

        if(Math.random() < this.explorationRate){
            return actions[Math.floor(Math.random() * actions.length)];
        }
        if(!this.qTable[JSON.stringify(state)]){
            this.qTable[JSON.stringify(state)] = {};
        }
        var takenAction = actions[0];
        var bestQValue = this.qTable[JSON.stringify(state)][JSON.stringify(takenAction)] || 0;
        //console.log(bestQValue);
        //console.log(this.qTable[state]);
        

        actions.forEach(action => {
            var qValue = this.qTable[JSON.stringify(state)][JSON.stringify(action)] || 0;
            //console.log(qValue, bestQValue);
            //console.log(state, action, qValue);
            
            
            if(qValue > bestQValue){
                bestQValue = qValue;
                takenAction = action;
                //console.log(bestQValue, action);
                
            }
        });

        return takenAction;

    }

    updateQValue(state, newState, action, reward){

        if(!this.qTable[JSON.stringify(state)]){
            this.qTable[JSON.stringify(state)] = {};
        }
        if(!this.qTable[JSON.stringify(newState)]){
            this.qTable[JSON.stringify(newState)] = {};
        }

        var currQValue = this.qTable[JSON.stringify(state)][JSON.stringify(action)] || 0;
        var maxFutureQValue = -Infinity;
            for(var act in this.qTable[JSON.stringify(newState)]){
                if(this.qTable[JSON.stringify(newState)][act] > maxFutureQValue){
                    maxFutureQValue = this.qTable[JSON.stringify(newState)][act];
                }
                
            }
        //console.log(maxFutureQValue, currQValue);
        
        var newQValue = currQValue + this.learingRate * (reward + maxFutureQValue * this.discountFactor - currQValue);
        this.qTable[JSON.stringify(state)][JSON.stringify(action)] = newQValue;
        // }else{
        //     console.log(this.explorationRate);
            
        // }
        

    }

    decayEpsilon(){

        this.explorationRate = Math.max(this.epsilonMin, this.explorationRate * this.explorationDecay);
        
    }
}