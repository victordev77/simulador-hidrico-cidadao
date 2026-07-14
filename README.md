
```markdown
# 💧 Simulador Hídrico Cidadão

A web-based simulator developed to interactively demonstrate the impact of different artificial coverings on reducing water evaporation from reservoirs.

The project was created as part of the study **“Mathematical Modeling of Artificial Coverings for Evaporation Mitigation at the Jerimum Reservoir”**, presented at **Ceará Científico**.


---

## 📱 Demonstração


## Features

* **Scenario Simulation:** Simulate different evaporation scenarios based on climate inputs.
* **Covering Comparison:** Direct comparison between uncovered reservoirs and reservoirs with artificial coverings.
* **Real-time Indicators:** Instant calculation of water saved and evaporation rates.
* **Interactive Dashboard:** Modern data visualization using **Chart.js**.
* **3D Visualization:** A three-dimensional representation of the Jerimum reservoir using **Three.js**.
* **Educational Purpose:** Intuitive UI designed for students, researchers, and communities.

## Technologies Used

* **Frontend:** HTML5, CSS3, JavaScript (ES6+)
* **Charts:** Chart.js
* **3D Engine:** Three.js

## How to Run

### 1. Clone the repository
```bash
git clone [https://github.com/victormakyver/simulador-hidrico-cidadao.git](https://github.com/victormakyver/simulador-hidrico-cidadao.git)

```

### 2. Navigate to the project folder

```bash
cd simulador-hidrico-cidadao

```

### 3. Start a local server

Because of Three.js file-loading security (CORS), you need a local server. Choose one:

* **VS Code:** Use the **Live Server** extension.
* **Python (Recommended):** Run the command below in your terminal:
```bash
python -m http.server
# or 'python3 -m http.server' on some systems

```

### 4. Access the simulator

Open your browser and visit: [http://localhost:8000](http://localhost:8000)

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

## Objective

The **Simulador Hídrico Cidadão** aims to make concepts related to mathematical modeling, sustainability, and water conservation more accessible through an interactive platform.

By translating complex mathematical formulas into 3D visuals and dynamic charts, the platform empowers students, researchers, and local communities to understand practical solutions for water scarcity.

## License

This project is licensed under the MIT License. See the [LICENSE](https://www.google.com/search?q=LICENSE) file for more information.
