import numpy as np
import string

replace_punc_dict = dict.fromkeys(string.punctuation)
replace_punc_dict[' '] = ''
table = str.maketrans(replace_punc_dict)


def preprocess_inp(st, table):
    st = st.lower()
    st = st.translate(table)
    return st


similarity = np.load('model/NPData/res.npz')['arr_0']
lookup = np.load('model/NPData/lookup.npy', allow_pickle=True)
show = np.load('model/NPData/show.npy', allow_pickle=True)

title = preprocess_inp(input(), table)

idx = np.where(lookup == title)
idx = idx[0]
sim_scores = similarity[idx][0]
indexed_sim = list(enumerate(sim_scores))
similarity_score = sorted(indexed_sim, key=lambda x: x[1], reverse=True)
show_title = similarity_score[1:9]
results = []
for i, _ in show_title:
    results.append(show[i])
print(results)
