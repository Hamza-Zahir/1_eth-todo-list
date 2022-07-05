import Web3 from "web3";
import ABI from "../json/abiContract.json";
const state = {
  CurrentAccount: "",
  ChainId: "",
  allTasks: [],
};

const getters = {
  CurrentAccount: (state) => state.CurrentAccount,
  ChainId: (state) => state.ChainId,
  allTasks: (state) => state.allTasks,
};
const actions = {
  async connectMetamask({ commit }) {
    const ethereum = window.ethereum;
    if (!ethereum) {
      window.open("https://metamask.io", "blank");
    } else {
      const accounts = await ethereum.request({
        method: "eth_requestAccounts",
      });
      commit("setCurrentAccount", accounts[0]);

      try {
        await ethereum.request({
          method: "wallet_switchEthereumChain",
          params: [{ chainId: `0x${Number(4).toString(16)}` }],
        });
      } catch (switchError) {
        console.log(switchError);
        if (switchError.code === 4902) {
          try {
            await ethereum.request({
              method: "wallet_addEthereumChain",
              params: [
                {
                  chainId: `0x${Number(4).toString(16)}`,
                  chainName: "Rinkeby",
                  nativeCurrency: {
                    name: "Rinkeby Ether",
                    symbol: "RIN",
                    decimals: 18,
                  },
                  rpcUrls: ["https://rinkeby.infura.io/v3/"],
                  blockExplorerUrls: ["https://rinkeby.etherscan.io"],
                },
              ],
            });

            await ethereum.request({ method: "eth_chainId" }).then((resalt) => {
              commit("setChainId", Number(resalt));
            });
            ethereum.on("chainChanged", handleChainChanged);
            function handleChainChanged(_chainId) {
              window.location.reload();
            }
          } catch (error) {
            console.log(error);
          }
        }
      }
    }
  },
  async checkWalletIsConnected({ commit }) {
    const ethereum = window.ethereum;
    let web3 = new Web3(Web3.givenProvider || ethereum);
    let accounts = await web3.eth.getAccounts();
    if (accounts.length) {
      commit("setCurrentAccount", accounts[0]);
      await ethereum.request({ method: "eth_chainId" }).then((resalt) => {
        commit("setChainId", Number(resalt));
      });
      ethereum.on("chainChanged", handleChainChanged);
      function handleChainChanged(_chainId) {
        window.location.reload();
      }
    }
  },
  async GetAllTasks({ commit }) {
    let allTasks = [];
    const ethereum = window.ethereum;

    if (ethereum) {
      const web3 = new Web3(Web3.givenProvider || ethereum);
      const TodoList_contract = new web3.eth.Contract(
        ABI,
        "0xd3A5689dA64e32414C3345A1069E36b4b6259D9f"
      );
      const _taskCount = await TodoList_contract.methods.taskCount().call();

      for (let i = 1; i <= Number(_taskCount); i++) {
        const _task = await TodoList_contract.methods.tasks(i).call();

        const _taskId = Number(_task[0]);
        const _taskContent = _task[1];
        const _taskCompleted = _task[2];
        allTasks.push({
          taskId: _taskId,
          taskContent: _taskContent,
          taskCompleted: _taskCompleted,
        });
      }
      commit("setAllTasks", allTasks);
    }
  },
  async creatNewTask(state, _taskContent) {
    const _CurrentAccount = this.state.CurrentAccount;
    const ethereum = window.ethereum;
    if (ethereum) {
      if (!_CurrentAccount.length) {
        window.alert("Please connect to Metamask.");
      } else if(this.state.ChainId == 4) {
        const web3 = new Web3(Web3.givenProvider || ethereum);
        const TodoList_contract = new web3.eth.Contract(
          ABI,
          "0xd3A5689dA64e32414C3345A1069E36b4b6259D9f"
        );
        await TodoList_contract.methods
          .createTask(_taskContent)
          .send({
            from: _CurrentAccount,
          })
          .then(() => {
            window.location.reload();
          });
      }
    }
  },
  async toggleCompleted(state, _tokenId) {
    const _CurrentAccount = this.state.CurrentAccount;
    const ethereum = window.ethereum;
    if (ethereum) {
      if (!_CurrentAccount) {
        window.alert("Please connect to Metamask.");
      } else if(this.state.ChainId == 4) {
        const web3 = new Web3(Web3.givenProvider || ethereum);
        const TodoList_contract = new web3.eth.Contract(
          ABI,
          "0xd3A5689dA64e32414C3345A1069E36b4b6259D9f"
        );
        await TodoList_contract.methods
          .toggleCompleted(_tokenId)
          .send({
            from: _CurrentAccount,
          })
          .then(() => {
            window.location.reload();
          });
      }
    }
  },
};
const mutations = {
  setCurrentAccount: (state, addres) => (state.CurrentAccount = addres),
  setChainId: (state, chainId) => (state.ChainId = chainId),
  setAllTasks: (state, tasks) => (state.allTasks = tasks),
};

export default {
  state,
  getters,
  actions,
  mutations,
};
