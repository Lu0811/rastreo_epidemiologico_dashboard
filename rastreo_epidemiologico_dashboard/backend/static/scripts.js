window.onload = function () {
  // Inicializar los gráficos cuando la página cargue
  cargarAreaApilada();
  cargarDistribucionBoletos();
  cargarComparacionTotal();
  
  // Agregar funcionalidad para aplicar filtros de fecha
  document.getElementById("apply-filters").addEventListener("click", function() {
    cargarAreaApilada();
    cargarDistribucionBoletos();
    cargarComparacionTotal();
  });
};

// 1️⃣ Cargar el gráfico de Área Apilada (Evolución mensual de boletos vendidos)
function cargarAreaApilada() {
  const startDate = document.getElementById('start-date').value;
  const endDate = document.getElementById('end-date').value;
  
  const url = `/comparativo_mensual?start_date=${startDate}&end_date=${endDate}`;
  
  d3.json(url).then(data => {
    const margin = { top: 30, right: 30, bottom: 30, left: 50 };
    const width = 800 - margin.left - margin.right;
    const height = 300 - margin.top - margin.bottom;

    const svg = d3.select("#grafico-area-apilada")
      .append("svg")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
      .append("g").attr("transform", `translate(${margin.left},${margin.top})`);

    const parseDate = d3.timeParse("%Y-%m");
    data.forEach(d => d.fecha = parseDate(d.mes));

    const keys = ["aereos", "rodoviarios"];

    const stackedData = d3.stack().keys(keys)(data);

    const x = d3.scaleTime()
      .domain(d3.extent(data, d => d.fecha))
      .range([0, width]);

    const y = d3.scaleLinear()
      .domain([0, d3.max(data, d => d.aereos + d.rodoviarios)])
      .range([height, 0]);

    svg.append("g").call(d3.axisLeft(y));
    svg.append("g").attr("transform", `translate(0,${height})`).call(d3.axisBottom(x));

    const color = d3.scaleOrdinal().domain(keys).range(["#1f77b4", "#ff7f0e"]);

    svg.selectAll("mylayers")
      .data(stackedData)
      .enter().append("path")
      .attr("fill", d => color(d.key))
      .attr("d", d3.area()
        .x(d => x(d.data.fecha))
        .y0(d => y(d[0]))
        .y1(d => y(d[1]))
      );
  });
}

// 2️⃣ Cargar el gráfico de Distribución de Boletos Vendidos (Aéreo vs Rodoviario)
function cargarDistribucionBoletos() {
  const startDate = document.getElementById('start-date').value;
  const endDate = document.getElementById('end-date').value;
  
  const url = `/distribucion_boletos?start_date=${startDate}&end_date=${endDate}`;

  d3.json(url).then(data => {
    const margin = { top: 30, right: 30, bottom: 30, left: 50 };
    const width = 800 - margin.left - margin.right;
    const height = 300 - margin.top - margin.bottom;

    const svg = d3.select("#grafico-distribucion-boletos")
      .append("svg")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
      .append("g").attr("transform", `translate(${margin.left},${margin.top})`);

    const x = d3.scaleBand()
      .domain(data.map(d => d.mes))
      .range([0, width])
      .padding(0.1);

    const y = d3.scaleLinear()
      .domain([0, d3.max(data, d => d.rodoviarios + d.aereos)])
      .nice()
      .range([height, 0]);

    svg.selectAll("rect")
      .data(data)
      .enter().append("rect")
      .attr("x", d => x(d.mes))
      .attr("y", d => y(d.rodoviarios + d.aereos))
      .attr("width", x.bandwidth())
      .attr("height", d => height - y(d.rodoviarios + d.aereos))
      .attr("fill", "#2ecc71");

    svg.append("g")
      .attr("class", "x axis")
      .attr("transform", "translate(0," + height + ")")
      .call(d3.axisBottom(x).tickSize(0));

    svg.append("g")
      .attr("class", "y axis")
      .call(d3.axisLeft(y).ticks(5));
  });
}

// 3️⃣ Cargar el gráfico de Comparación Total de Boletos Vendidos (Rodoviario vs Aéreo)
function cargarComparacionTotal() {
  const url = `/comparacion_total`;

  d3.json(url).then(data => {
    const width = 400;
    const height = 400;

    const svg = d3.select("#grafico-comparacion-total")
      .append("svg")
      .attr("width", width)
      .attr("height", height)
      .append("g")
      .attr("transform", `translate(${width / 4}, ${height / 4})`);

    const totalBoletos = [data.rodoviarios, data.aereos];
    const labels = ["Rodoviarios", "Aéreos"];

    const color = d3.scaleOrdinal().range(["#ff7f0e", "#1f77b4"]);

    const pie = d3.pie();
    const arc = d3.arc().innerRadius(0).outerRadius(height / 2);

    const g = svg.selectAll(".arc")
      .data(pie(totalBoletos))
      .enter().append("g")
      .attr("class", "arc");

    g.append("path")
      .attr("d", arc)
      .style("fill", (d, i) => color(i));

    g.append("text")
      .attr("transform", d => "translate(" + arc.centroid(d) + ")")
      .attr("dy", ".35em")
      .style("text-anchor", "middle")
      .text((d, i) => labels[i]);

    svg.append("text")
      .attr("x", width / 2)
      .attr("y", 10)
      .style("text-anchor", "middle")
      .style("font-size", "20px")
      .text("Comparación de Boletos");
  });
}
