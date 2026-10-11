# Simulador Hídrico Cidadão

**Scientific Simulation | Mathematical Modeling | Environmental Technology**

An interactive web application developed to investigate water evaporation mitigation strategies in reservoirs through mathematical modeling, scientific data visualization and computational simulations.

**🏆 Regional Winner — Ceará Científico 2026**

🌐 **[Launch Live Application](https://simuladorhidrico.vercel.app/)** | 💻 **[Source Code](https://github.com/victordev77/simulador-hidrico-cidadao)**

---

## Overview

The **Simulador Hídrico Cidadão** is a scientific and educational web application designed to investigate the potential of artificial floating covers in reducing water evaporation from reservoirs.

Developed as part of a scientific research project focused on the **Jerimum Reservoir, located in Irauçuba, Ceará, Brazil**, the platform transforms mathematical models and scientific parameters into interactive simulations.

The project combines **software development, environmental research and mathematical modeling**, providing an accessible environment for exploring water conservation strategies and understanding their potential impact on water security.

## Scientific Context

Water evaporation is a significant challenge for water security in semi-arid regions, where high temperatures, intense solar radiation and prolonged droughts increase pressure on available water resources.

The research investigates two artificial floating cover alternatives:

- **HDPE Floating Spheres:** spherical elements that form a floating barrier over the water surface, reducing direct exposure to atmospheric conditions.
- **Hexagonal Floating Covers:** modular floating structures designed to provide extensive surface coverage and reduce evaporation losses.

The application uses mathematical relationships and research-based parameters to estimate potential evaporation reduction and preserved water volumes under different scenarios.

### Research Reference Parameters

| Parameter | Reference Value |
|---|---|
| Annual evaporation | 2,344.7 mm/year |
| Jerimum Reservoir capacity | 18.75 hm³ |
| Floating sphere surface coverage | 90.69% |
| Floating sphere surface porosity | 9.31% |
| Maximum modeled reduction — HDPE spheres | 74.86% |
| Theoretical hexagonal surface coverage | 98% |
| Maximum modeled reduction — hexagonal covers | 88.59% |

These values represent research references and modeled scenarios, not guaranteed field performance.

## Features

### Interactive Simulation

Configure simulation parameters and explore different water conservation scenarios.

- Reservoir surface area and environmental parameters
- Annual evaporation estimates
- Artificial floating cover alternatives
- Estimated evaporation reduction
- Potential preserved water volume

### Comparative Analysis

Compare evaporation scenarios with and without artificial floating covers, evaluating their estimated contribution to water conservation.

### Scientific Dashboard

Explore simulation results through interactive charts, quantitative indicators and comparative visualizations developed with **Chart.js**.

### 3D Visualization

Interactive three-dimensional representations developed with **Three.js**, allowing users to visualize reservoir coverage scenarios and better understand the proposed mitigation strategies.

### Scientific and Educational Reports

Generate reports that communicate simulation results, mathematical assumptions and estimated outcomes.

The reporting functionality supports scientific interpretation and educational exploration of the simulated scenarios.

### Responsive Interface

The application provides a responsive interface designed for desktop, tablet and mobile devices, improving accessibility across different screen sizes.

## Technology Stack

| Technology | Purpose |
|---|---|
| HTML5 | Application structure |
| CSS3 | Interface design and responsive layouts |
| JavaScript | Application logic and mathematical calculations |
| Chart.js | Interactive charts and data visualization |
| Three.js | Interactive 3D visualization |
| Vercel | Application deployment |

## Scientific Methodology

The application estimates evaporation losses and potential water savings using mathematical relationships between reservoir surface area, annual evaporation and modeled cover efficiency.

### Evaporation Volume

The simplified annual evaporation volume is calculated as:

$$
V = A \times E
$$

Where:

- **V** = Estimated evaporation volume (m³)
- **A** = Reservoir surface area (m²)
- **E** = Annual evaporation depth (m)

### Preserved Water Volume

The estimated preserved water volume is calculated as:

$$
V_{\text{saved}} = V \times R
$$

Where:

- **V_saved** = Estimated preserved water volume (m³)
- **V** = Estimated evaporation volume without artificial coverage (m³)
- **R** = Modeled evaporation reduction factor, expressed as a decimal

These mathematical relationships provide a simplified basis for comparing different scenarios.

Actual results depend on the assumptions, parameters and reduction coefficients adopted in each simulation.

## Getting Started

### Prerequisites

- Git
- A modern web browser
- A local development server, such as the Live Server extension for Visual Studio Code

### Installation

Clone the repository:

```bash
git clone https://github.com/victordev77/simulador-hidrico-cidadao.git
```

Navigate to the project directory:

```bash
cd simulador-hidrico-cidadao
```

Open the project in Visual Studio Code:

```bash
code .
```

Start a local development server using Live Server or another compatible HTTP server.

Open the local address provided by the server in your browser.

## Research & Recognition

### 🏆 Ceará Científico 2026 — Regional Winner

Developed as part of the scientific research project:

**“Modelagem Matemática de Coberturas Artificiais para Mitigação da Evaporação no Açude Jerimum: Segurança Hídrica e Cidadania em Irauçuba”**

**Research Authors**
- Ana Júlia Sousa Bastos
- Victor Hugo Silva Lopes

**Research Advisor**
- Fabrício Mota Gonçalves

**Web Application Development**
- Victor Hugo Silva Lopes

The project won the regional stage of **Ceará Científico 2026**, demonstrating how scientific research and software development can work together to investigate environmental challenges and support scientific education.

## Scientific Limitations

The Simulador Hídrico Cidadão is intended for scientific exploration, educational use and comparative scenario analysis.

Its results depend on mathematical assumptions, reference parameters and user-defined simulation conditions.

Actual evaporation reduction may vary according to environmental conditions, reservoir characteristics, material properties and operational factors.

The platform does not replace field measurements, engineering assessments or experimental validation.

## Project Purpose

The project aims to make scientific research more accessible through interactive technology, allowing students, researchers and interested citizens to explore mathematical models and understand the potential contribution of evaporation mitigation strategies to water security.

By connecting environmental science with software development, the Simulador Hídrico Cidadão demonstrates how digital tools can support education, scientific communication and the investigation of real-world challenges.

---

**Developed through scientific research, mathematical modeling and software engineering.**