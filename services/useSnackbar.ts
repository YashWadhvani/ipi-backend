export const useSnackbar = () => {
    const state = useState('snackbar', () => ({ open:false, message:'', type:'info', timeout:3000, timer:null as any }))
    function show(message: string, type: 'info'|'success'|'error'|'warn' = 'info', timeout = 3000) {
      if (state.value.timer) clearTimeout(state.value.timer)
      state.value.message = message
      state.value.type = type
      state.value.open = true
      state.value.timer = setTimeout(() => { state.value.open = false }, timeout)
    }
    function hide() {
      if (state.value.timer) clearTimeout(state.value.timer)
      state.value.open = false
    }
    return { snackbar: state, show, hide }
  }
  