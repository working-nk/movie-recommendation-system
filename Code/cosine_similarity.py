# to check how much two or more titles are similar using cosine similarity

from sklearn.feature_extraction.text import CountVectorizer
from sklearn.metrics.pairwise import cosine_similarity

text = ["London Paris London", "Paris Paris London"]
cv = CountVectorizer()
cv_fit = cv.fit_transform(text)

cv_fit = cv_fit.toarray()
# print(cv_fit)
print(cosine_similarity(cv_fit))

