import create from 'zustand'

const useStore = create((set) => ({

    jwtRecieved:false


    //   increasePopulation: () => set(state => ({ bears: state.bears + 1 })),
    //   removeAllBears: () => set({ bears: 0 })
}))

export default useStore