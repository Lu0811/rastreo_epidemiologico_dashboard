import pandas as pd

# Cargar los archivos CSV
municipio_path = 'data/municipio.csv'
estado_path = 'data/estado.csv'
rodoviarios_path = 'data/rodoviarios_final.csv'
aereos_path = 'data/aereos_final.csv'

# Leer los archivos CSV en DataFrames de pandas
municipio = pd.read_csv(municipio_path)
estado = pd.read_csv(estado_path)
rodoviarios = pd.read_csv(rodoviarios_path)
aereos = pd.read_csv(aereos_path)

# Función para agregar un ID único a cada registro
def mapear_ids(df):
    df['ID'] = df.index
    return df

# Mapear los IDs
municipio = mapear_ids(municipio)
estado = mapear_ids(estado)
rodoviarios = mapear_ids(rodoviarios)
aereos = mapear_ids(aereos)

# Mostrar las primeras filas de cada DataFrame con los IDs
print("Municipio con ID asignado:")
print(municipio.head())  # Muestra las primeras filas con el ID

print("\nEstado con ID asignado:")
print(estado.head())  # Muestra las primeras filas con el ID

print("\nRodoviarios con ID asignado:")
print(rodoviarios.head())  # Muestra las primeras filas con el ID

print("\nAereos con ID asignado:")
print(aereos.head())  # Muestra las primeras filas con el ID

# Opcional: Guardar los DataFrames modificados con los IDs en nuevos archivos CSV
municipio.to_csv('data/municipio_con_id.csv', index=False)
estado.to_csv('data/estado_con_id.csv', index=False)
rodoviarios.to_csv('data/rodoviarios_con_id.csv', index=False)
aereos.to_csv('data/aereos_con_id.csv', index=False)
