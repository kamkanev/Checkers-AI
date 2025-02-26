# Checkers-AI

A checkers AI project for the course Introduction to Reinforcement Learning.

## Download

Download the .zip file from the git page or use

```bash
git clone https://github.com/kamkanev/Checkers-AI.git
```

```git
gh repo clone kamkanev/Checkers-AI
```

## Installation

Just run the `start.html` in any browser. And play agains an AI.

## Training

Uses the `Simulation.js` class to train two AI's. I'm using a Random agent and Q-learning. *Keep in mind the traing process isn't saved after refresh or restart.*

**Benchmark**

Used for testing and traing the AI model in the browser. It also generates statistics.

**Node.js training**

```bash
npm install
npm start
```

Traing the model using Node.js. *Have to implement model saving in file system!*

## Furute TODO

- [ ]  Implement model saving

- [ ]  Import and Export of trained models

- [ ]  Add more agents (.e.g SARSA, DNQ, ...)
