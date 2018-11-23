/* Constants and useful vars */
const FPS = 10;

let target = "Tuomas Ravander";
let popsize = 300;
let mutRate = 1 / 100;
let loop = null;
let population = [];
let totalGen = 0;

/* DNA-class */
class DNA {
  constructor() {
    this.data = generateRandomWord(target.length);
    this.fitness = 0;
  }
  checkFitness() {
    let score = 0;
    for (let i = 0; i < this.data.length; i++) {
      if (this.data.charAt(i) == target.charAt(i)) score++;
    }
    this.fitness = Math.round((score / this.data.length) * 100);
  }
  crossover(partner) {
    let child = new DNA();
 
    let midpoint = Math.round(Math.random() * (this.data.length - 1));

    let coWord = "";
 
    for (let i = 0; i < this.data.length; i++) {
      if (i < midpoint) {
        coWord += this.data.charAt(i);
      } else {
        coWord += partner.data.charAt(i);
      }
    }

    child.data = coWord;
 
    return child;
  }
  mutate() {
    let mutatedString = "";
    for (let i = 0; i < this.data.length; i++) {
      if (Math.random() < mutRate) mutatedString += generateRandomWord(1);
      else mutatedString += this.data.charAt(i);
    }
    this.data = mutatedString;
  }
}

/* Main update-loop */
function update() {
  population.forEach(dna => {
    dna.checkFitness();
  });

  population.sort((dnaa, dnab) => {
    if (dnaa.fitness < dnab.fitness) return 1;
    else if (dnaa.fitness > dnab.fitness) return -1;
    else return 0;
  });

  if (population[0].fitness == 100) {
    clearInterval(loop);
    loop = null;
  } 

  draw(population[0]);

  let matingPool = [];
  for (let i = 0; i < population.length; i++) {
    let n = population[i].fitness;
    for (let j = 0; j < n; j++) {
      matingPool.push(population[i]);
    }
  }

  for (let i = 0; i < population.length; i++) {
    let a = Math.round(Math.random() * (matingPool.length - 1));
    let b = Math.round(Math.random() * (matingPool.length - 1));
    let parentA = new DNA();
    let parentB = new DNA();
    parentA.data = matingPool[a].data;
    parentB.data = matingPool[b].data;

    let child = parentA.crossover(parentB);
    child.mutate();

    population[i] = child;
  }
  totalGen++;
}

/* Draw updates on screen */
function draw(bestFit) {
  let popstring = "";
  let tempData = "", tempFit = 0;

  bestFitnessText.innerHTML = bestFit.data;
  totalGenText.innerHTML = "Generation: " + totalGen;

  population.forEach(dna => {
    tempData = dna.data;
    tempFit = dna.fitness;
    popstring += "Genes: " + tempData + ", Fitness: " + tempFit + "%<br>";
  });
  populationList.innerHTML = popstring;
}

/* Generates random words and letters for DNA's init and mutation */
function generateRandomWord(length) {
  let word = "";
  let possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZÅÄÖabcdefghijklmnopqrstuvwxyzåäö- ";

  for (let i = 0; i < length; i++) {
    word += possible.charAt(Math.floor(Math.random() * possible.length));
  }

  return word;
}

/* Initialize the algorithm */
function init(curTarget, curPopsize, curMutRate) {
  target = curTarget;
  popsize = curPopsize;
  mutRate = curMutRate / 100;

  population = [];
  for (let i = 0; i < popsize; i++) {
    population[i] = new DNA();
  }

  if (loop) {
    clearInterval(loop);
    loop = null;
  }
  totalGen = 0;
  loop = setInterval(update, 1000 / FPS);

  console.log("AI Started");
}

/* Attach DOM-elements */
const startBtn = document.getElementById("start-btn");
const populationList = document.getElementById("population");
const targetInput = document.getElementById("target-input");
const popsizeInput = document.getElementById("popsize-input");
const mutRateInput = document.getElementById("mut-rate-input");
const bestFitnessText = document.getElementById("best-fit-text");
const totalGenText = document.getElementById("total-gen-text");

startBtn.addEventListener("click", e => {
  e.preventDefault();
  init(targetInput.value, popsizeInput.value, mutRateInput.value);
});