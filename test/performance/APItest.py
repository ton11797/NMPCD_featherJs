from locust import HttpLocust, TaskSet, task, between
import json
class UserBehaviour(TaskSet):
    accessToken = ""
    def on_start(self):
        """ on_start is called when a Locust start before any task is scheduled """
        self.login()

    def on_stop(self):
        """ on_stop is called when the TaskSet is stopping """
        self.logout()

    def login(self):
        with self.client.post("/authentication", {"strategy": "local","email": "test@test.com","password": "test2"}, catch_response=True) as response:
            obj = json.loads(response.content)
            self.accessToken = obj['accessToken']
    def logout(self):
        print("out")
    
    @task(11)
    def getDashboard(self):
        self.client.post("/dashboard/update",{"versionUUID":"3b410650-570d-11ea-b793-7bb993f760a9"},headers={"authorization": "Bearer " + self.accessToken})

    @task(10)
    def getSDsearch(self):
        self.client.post("/search/sd-relate",{"schemaName":"SUB","versionUUID":"3b410650-570d-11ea-b793-7bb993f760a9","destination":"STD24","source":"477f7c30-570d-11ea-b793-7bb993f760a9"},headers={"authorization": "Bearer " + self.accessToken})

    @task(9)
    def getConfirmMap(self):
        self.client.get("/confirm/confirm-link?_version=537eca50-57ca-11ea-892f-69ef0d1b8520&_node1=GP",headers={"authorization": "Bearer " + self.accessToken})

    @task(8)
    def getConfirmData(self):
        self.client.post("/confirm/confirm-get",{"versionUUID":"537eca50-57ca-11ea-892f-69ef0d1b8520","type":0},headers={"authorization": "Bearer " + self.accessToken})

    @task(7)
    def getRelate(self):
        self.client.post("/data/search-relate",{"schemaName": "GP", "uuid": "9cba0b30-57ca-11ea-892f-69ef0d1b8520"},headers={"authorization": "Bearer " + self.accessToken})

    @task(6)
    def getData(self):
        self.client.post("/data/search-data",{"schemaName":"GP","versionUUID":"8bd50c90-7717-11ea-a5fe-918d1e36ac93","count":True},headers={"authorization": "Bearer " + self.accessToken})
    
    @task(5)
    def getConfig(self):
        self.client.get("/systemManage/config",headers={"authorization": "Bearer " + self.accessToken})

    @task(4)
    def getVersion(self):
        self.client.get("/versionControl/get-version",headers={"authorization": "Bearer " + self.accessToken})

    @task(3)
    def schemaVersion(self):
        self.client.get("/schema/3ae578d0-570d-11ea-b793-7bb993f760a9",headers={"authorization": "Bearer " + self.accessToken})
    
    @task(2)
    def schema(self):
        self.client.get("/schema",headers={"authorization": "Bearer " + self.accessToken})

    # @task(1)
    # def index(self):
    #     self.client.get("/")

class WebsiteUser(HttpLocust):
    task_set = UserBehaviour
    wait_time = between(5, 9)