# lower-case inputs, to search in database
# save final values to not perform these operations again and again
# provide functionality with most popular titles
# create a javascript ui

import numpy as np
import pandas as pd
from sklearn.feature_extraction.text import CountVectorizer
from sklearn.metrics.pairwise import cosine_similarity

df = pd.read_csv('movie_dataset.csv')
df.head()

# df.columns
features = ['genres', 'keywords', 'popularity', 'cast', 'director']
data = pd.DataFrame(df['title'])
for f in features:
    temp = pd.DataFrame(df[f])
    data = pd.concat([data, temp], axis=1)

# data.head()
del df

# tells us about percentage of nan values
# len(data[data.isna().any(axis=1)]) / len(data) * 100

# so we cant get rid on nan as they are 8%, put empty string there
data.fillna('', inplace=True)

# len(data[data.isna().any(axis=1)])

dataX = data.drop(['title', 'popularity'], axis=1)
dataX["combined_features"] = dataX['genres'] + " " + dataX['keywords'] + " " + dataX['cast'] + " " + dataX['director']
# dataX['combined_features'].head()

cv = CountVectorizer()
cv_mat = cv.fit_transform(dataX['combined_features']).toarray()

similarity = cosine_similarity(cv_mat)

#prompt user for input movie
movie = "Avatar"
i = data[data['title'] == movie].index
i = i[0]

indexed_sim = list(enumerate(similarity[i]))
sorted_sim = sorted(indexed_sim, key=lambda x: x[1], reverse=True)
req_sim = sorted_sim[1:21]

# for i,_ in req_sim:
#     if df['vote_average'][i]>6.5 and df['vote_count'][i]>3000:
#         print(data['title'][i])

for i, _ in req_sim:
    print(data['title'][i])





