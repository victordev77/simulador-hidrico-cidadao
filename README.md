# 💧 Simulador Hídrico Cidadão

A web-based simulator developed to interactively demonstrate how different artificial coverings can reduce water evaporation from reservoirs.

The project was created as part of the study **“Mathematical Modeling of Artificial Coverings for Evaporation Mitigation at the Jerimum Reservoir”**, presented at **Ceará Científico**.

```markdown
![Simulator demonstration](assets/simulator-demo.png)
```

## Features

* **Scenario Simulation:** Simulates different evaporation scenarios based on climate inputs.
* **Covering Comparison:** Compares uncovered reservoirs with reservoirs using artificial coverings.
* **Real-Time Indicators:** Instantly calculates evaporation rates and estimated water savings.
* **Interactive Dashboard:** Displays simulation data through dynamic charts powered by **Chart.js**.
* **3D Visualization:** Provides a three-dimensional representation of the Jerimum Reservoir using **Three.js**.
* **Educational Purpose:** Offers an intuitive interface designed for students, researchers, and local communities.

## Technologies

* **Frontend:** HTML5, CSS3, and JavaScript (ES6+)
* **Charts:** Chart.js
* **3D Rendering:** Three.js

## How to Run

### 1. Clone the repository

```bash
git clone https://github.com/victormakyver/simulador-hidrico-cidadao.git
```

### 2. Navigate to the project directory

```bash
cd simulador-hidrico-cidadao
```

### 3. Start a local server

Because the project uses JavaScript modules and Three.js, it should be executed through a local server.

Choose one of the following options:

#### Visual Studio Code

Install and use the **Live Server** extension.

#### Python

Run:

```bash
python -m http.server
```

On some systems, use:

```bash
python3 -m http.server
```

### 4. Open the simulator

Access the following address in your browser:

```text
http://localhost:8000
```

## Project Structure

```text
simulador-hidrico-cidadao/
├── assets/
│   └── logo-simulador-hidrico.jpg
├── .gitignore
├── LICENSE
├── README.md
├── index.html
├── style.css
├── script.js
├── calculos.js
├── charts.js
└── threeScene.js
```

## Objective

The **Simulador Hídrico Cidadão** aims to make concepts related to mathematical modeling, sustainability, and water conservation more accessible through an interactive platform.

By translating mathematical models into dynamic charts and three-dimensional visualizations, the platform helps students, researchers, and local communities understand practical strategies for reducing water loss caused by evaporation.

## License

This project is licensed under the MIT License. See the [`LICENSE`](LICENSE) file for more information.
