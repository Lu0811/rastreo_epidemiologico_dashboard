from flask import Flask, render_template, jsonify, request
import pandas as pd
import os

app = Flask(__name__)

# 📁 Rutas a los archivos de datos
BASE = os.path.join(os.path.dirname(__file__), "data")
rod_path = os.path.join(BASE, "rodoviarios_final.csv")
aer_path = os.path.join(BASE, "aereos_final.csv")

# 📥 Cargar los datos
rod = pd.read_csv(rod_path)
aer = pd.read_csv(aer_path)

# 🧹 Limpieza de los datos
rod = rod.dropna(subset=["cod_origem", "cod_destino"])
aer = aer.dropna(subset=["cod_origem", "cod_destino"])

# -----------------------------------
# 1️⃣ Hipótesis 1: Variación mensual de boletos vendidos por tipo de transporte
@app.route("/comparativo_mensual")
def comparativo_mensual():
    try:
        # Crear una nueva columna de Año-Mes para ambos datasets
        rod["AnoMes"] = rod["MesViagem"].str.slice(3, 7) + "-" + rod["MesViagem"].str.slice(0, 2)
        aer["AnoMes"] = aer["Ano"].astype(str) + "-" + aer["Mes"].astype(str).str.zfill(2)

        # Agrupar por año y mes
        rod_mensual = rod.groupby("AnoMes")["QuantidaDeBilhetes"].sum().reset_index()
        aer_mensual = aer.groupby("AnoMes")["passageiros"].sum().reset_index()

        # Unir los datos por año y mes
        result = pd.merge(rod_mensual, aer_mensual, on="AnoMes", how="outer").fillna(0)
        result.columns = ["mes", "rodoviarios", "aereos"]

        return jsonify(result.to_dict(orient="records"))
    except Exception as e:
        return jsonify({"error": str(e)}), 500

# -----------------------------------
# 2️⃣ Hipótesis 2: Volumen total de boletos vendidos por tipo de transporte por mes
@app.route("/distribucion_boletos")
def distribucion_boletos():
    try:
        # Crear una nueva columna de Año-Mes para ambos datasets
        rod["AnoMes"] = rod["MesViagem"].str.slice(3, 7) + "-" + rod["MesViagem"].str.slice(0, 2)
        aer["AnoMes"] = aer["Ano"].astype(str) + "-" + aer["Mes"].astype(str).str.zfill(2)

        # Agrupar por mes
        rod_mensual = rod.groupby("AnoMes")["QuantidaDeBilhetes"].sum().reset_index()
        aer_mensual = aer.groupby("AnoMes")["passageiros"].sum().reset_index()

        # Unir los datos por año y mes
        result = pd.merge(rod_mensual, aer_mensual, on="AnoMes", how="outer").fillna(0)
        result.columns = ["mes", "rodoviarios", "aereos"]

        return jsonify(result.to_dict(orient="records"))
    except Exception as e:
        return jsonify({"error": str(e)}), 500

# -----------------------------------
# 3️⃣ Hipótesis 3: Total de boletos vendidos (rodoviarios vs aéreos)
@app.route("/comparacion_total")
def comparacion_total():
    try:
        # Total de boletos rodoviarios y aéreos
        total_rodoviarios = rod["QuantidaDeBilhetes"].sum()
        total_aereos = aer["passageiros"].sum()

        result = {
            "rodoviarios": total_rodoviarios,
            "aereos": total_aereos
        }

        return jsonify(result)
    except Exception as e:
        return jsonify({"error": str(e)}), 500

# -----------------------------------
# Página Principal
@app.route("/")
def index():
    return render_template("index.html")

if __name__ == "__main__":
    app.run(debug=True)
