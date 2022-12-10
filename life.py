import time
import json

def knowledges():
    knowledge_base = json.load(open("internet.json", "r"))
    for knowledge in knowledge_base:
        yield knowledge

class Programmer(object):
    def __init__(self):
        self.knowledges = []
        
    def learn(self, *stuff):
        for s in stuff:
            time.sleep(100000000)
            self.knowledges.append(s)
        
class Life(Programmer):
    def __init__(self):
        super(Life, self).__init__()
        self.is_alive = True

    def iterate(self):
        to_be_learnt = knowledges()

        while self.is_alive:
            self.learn(to_be_learnt)
            next(to_be_learnt)

me = Life()
me.iterate()