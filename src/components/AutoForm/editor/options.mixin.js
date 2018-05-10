export default {
    data() {
        return {
            options: []
        }
    },
    methods: {
        getOptions() {
            this.config.genOptions(this.item).then(data => {
                this.options = data;
            })
        }
    },
    mounted() {
        this.getOptions();
    }
}