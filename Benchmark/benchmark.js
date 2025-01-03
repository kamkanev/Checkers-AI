const ctx = document.getElementById('myChart');
const ctx2 = document.getElementById('myChart2');

var boardSizeInput = 6;

var QL = new QLearing();

var sim = new Simulation(new Board(boardSizeInput), new RandomAgent(), QL, 300);
sim.run();

console.log(sim.getWinRatios());
sim.number = 100;

// console.log("An other training!");
// sim.run();

console.log("Real testing!!!");


QL.explorationRate = 0.05;
QL.epsilonMin = 0.05;
sim.run();

console.log(sim.getWinRatios());


// QL.explorationDecay = 0.99;
// QL.explorationRate = 1;
// sim.number = 10;

// sim.run();

// console.log(sim.getWinRatios());

// sim.number = 100;
// QL.explorationRate = 0.1;
// sim.run();

// console.log(sim.getWinRatios());

var performTime = sim.getPerformanceInMicroSec();

performTime.forEach(perf => {
    for(var i =0; i < perf.length; i++){
        if(perf[i] == 0){
            perf[i] = 0.0001;
        }
    }
})

var perfchard = new Chart(ctx, {
  type: 'bar',
  data: {
    labels: ['1st gen', '2nd gen', '10th gen', '51th gen', '98th gen'],
    datasets: [{
      label: 'time(μs) of RNG',
      data: [performTime[0][0], performTime[1][0], performTime[9][0], performTime[50][0], performTime[97][0]],
      borderWidth: 1
    },
    {
        label: 'time(μs) of Q-Learing',
        data: [performTime[0][1], performTime[1][1], performTime[9][1], performTime[50][1], performTime[97][1]],
        borderWidth: 1
      }]
  },
  options: {
    scales: {
      y: {
        beginAtZero: true
      }
    },
    plugins: {
        customCanvasBackgroundColor: {
          color: 'white',
        }
      }
  }
});

var winChard = new Chart(ctx2, {
    type: 'pie',
    data: {
      labels: ['Wins RNG', 'Wins Q-Learning'],
      datasets: [{
        label: 'Win ratio',
        data: sim.getWinRatios(),
        hoverOffset: 1
      }]
    },
    options: {
      scales: {
        y: {
          beginAtZero: true
        }
      },
      plugins: {
        customCanvasBackgroundColor: {
          color: 'white',
        }
      }
    }
  });


  function downloadChards(){
    var a = document.createElement('a');
    a.href = perfchard.toBase64Image();
    a.download = 'perfChard.png';
    a.click();

    a.href = winChard.toBase64Image();
    a.download = 'winChard.png';
    a.click();
  }