<template>
  <div>
    <div
      class="bg-dark text-light p-2 d-flex justify-content-around align-items-center"
    >
      <h2 class="">Todo List Dapp</h2>
      <div class="btn btn-primary" :class="CurrentAccount && ChainId != 4 ? 'btn-warning' : ''" @click="connectMetamask">
        {{
          CurrentAccount && ChainId == 4
            ? `${CurrentAccount.slice(0, 5)}...${CurrentAccount.slice(
                CurrentAccount.length - 4
              )}` : CurrentAccount && ChainId != 4 ? 'network erore'
            : " Conect Wallet"
        }}
      </div>
    </div>
    <div
      class="p-2 mx-auto my-3 text-center col-11 col-md-10 col-lg-8 col-xl-6"
    >
      <form
        action=""
        class=""
        @submit="
          (e) => {
            e.preventDefault();
            CreatNewTask();
          }
        "
      >
        <input
          type="text"
          class="p-2 col-9 col-md-10"
          name=""
          id=""
          placeholder="Creat Task..."
          :value="taskContent"
          @input="
            (e) => {
              taskContent = e.target.value;
            }
          "
        />
        <input type="submit" class="p-2" value="Add Task" />
      </form>
    </div>
    <h2 v-if="loding" class="text-center">Loding...</h2>
    <div class="allTasks" v-if="allTasks.length">
      <div class="task m-2" v-for="task in allTasks" :key="task.taskId">
        <input
          type="checkbox"
          name=""
          :id="`task-${task.taskId}`"
          :checked="task.taskCompleted ? true : false"
          @click="
            () => {
              toggleCompleted(task.taskId);
            }
          "
        />
        <label
          :for="`task-${task.taskId}`"
          :style="
            task.taskCompleted
              ? 'color: dimgrey; text-decoration:line-through'
              : ''
          "
        >
          {{ task.taskContent }}
        </label>
      </div>
    </div>
  </div>
</template>
<script>
import { mapActions, mapGetters } from "vuex";
export default {
  data() {
    return {
      taskContent: "",
      completed: "",
      loding: false,
    };
  },
  computed: {
    ...mapGetters(["CurrentAccount"]),
    ...mapGetters(["ChainId"]),
    ...mapGetters(["allTasks"]),
  },
  mounted() {
    this.getAllTasks();
  },
  methods: {
    ...mapActions(["checkWalletIsConnected"]),
    ...mapActions(["connectMetamask"]),
    ...mapActions(["GetAllTasks"]),
    ...mapActions(["creatNewTask"]),
    ...mapActions(["toggleCompleted"]),
    async getAllTasks() {
      await this.checkWalletIsConnected();
      try {
        this.lodeing = true;
        await this.GetAllTasks().then((this.lodeing = false));
      } catch (error) {
        console.log(error);
      }
    },

    async CreatNewTask() {
      if (this.taskContent) {
        await this.creatNewTask(this.taskContent);
        this.taskContent = "";
      }
    },
  },
};
</script>
<style scoped>
.allTasks {
  width: fit-content;
  margin: 10px auto;
}
</style>
