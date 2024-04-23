import pandas as pd
import numpy as np
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import StandardScaler
from sklearn.linear_model import LogisticRegression
from sklearn.neighbors import KNeighborsClassifier
from sklearn.svm import SVC
from sklearn.naive_bayes import GaussianNB
from sklearn.tree import DecisionTreeClassifier
from sklearn.ensemble import RandomForestClassifier
import tensorflow as tf
from tensorflow.keras import layers, models
from sklearn.metrics import accuracy_score
import matplotlib.pyplot as plt
import seaborn as sns

# Read the dataset
dataset = pd.read_csv("server/upi_fraud_dataset.csv", index_col=0)

# Preprocess the dataset
dataset = dataset.drop(columns=["category", "state"])

# Split the dataset
x = dataset.iloc[:, :10].values
y = dataset.iloc[:, 7].values

x_train, x_test, y_train, y_test = train_test_split(
    x, y, test_size=0.15, random_state=0
)

# Standardize the data
scaler = StandardScaler()
x_train = scaler.fit_transform(x_train)
x_test = scaler.transform(x_test)

# Define a dictionary of models
models = {
    "Logistic Regression": LogisticRegression(random_state=0),
    "K-Nearest Neighbors": KNeighborsClassifier(n_neighbors=5, metric="minkowski", p=2),
    "Support Vector Machine": SVC(kernel="linear", random_state=0),
    "Naive Bayes": GaussianNB(),
    "Decision Tree": DecisionTreeClassifier(criterion="entropy", random_state=0),
    "Random Forest": RandomForestClassifier(),
    "Convolutional Neural Network": tf.keras.models.Sequential(
        [
            tf.keras.layers.Dense(64, input_dim=8, activation="relu"),
            tf.keras.layers.Dense(128, activation="relu"),
            tf.keras.layers.Dense(1, activation="sigmoid"),
        ]
    ),
}

# Train and evaluate models
results = []

for model_name, model in models.items():
    if isinstance(model, tf.keras.models.Sequential):
        model.compile(
            optimizer="adam", loss="binary_crossentropy", metrics=["accuracy"]
        )
        model.fit(x_train, y_train, batch_size=32, epochs=200, verbose=0)
        _, accuracy = model.evaluate(x_test, y_test, verbose=0)
    else:
        model.fit(x_train, y_train)
        y_pred = model.predict(x_test)
        accuracy = accuracy_score(y_test, y_pred)

    results.append((model_name, accuracy * 100))

# Create a DataFrame to display results
df = pd.DataFrame(results, columns=["Algorithm Name", "Accuracy score (%)"])
df = df.sort_values("Accuracy score (%)", ascending=False)

# Display results
print(df)

# Create a bar plot of accuracy scores
fig, ax = plt.subplots(figsize=(10, 5))
sns.barplot(x="Accuracy score (%)", y="Algorithm Name", data=df)
plt.show()
