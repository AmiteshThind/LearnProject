import create from 'zustand'

const useStore = create(set => ({
  auth: {
        user:undefined,
        role:''},
    api:{
        getInstructorCourses: (instructor)=>{
            
        }
    }
  

//   increasePopulation: () => set(state => ({ bears: state.bears + 1 })),
//   removeAllBears: () => set({ bears: 0 })
}))