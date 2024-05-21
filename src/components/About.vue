<template>
    <h2>
        This is About Page
        <b-button variant="primary">Test Button</b-button>
        <button class="btn btn-primary">butotn</button>
        <b-table :items="items"></b-table>
    </h2>
</template>

<script>

export default {
    data() {
        return {
            items: [
                {age: 18,
                    name: 'test'
                },
                {age: 20,
                    name: 'test2'
                },
                {age: 19,
                    name: 'test3'
                },
            ]
        }
    },
};
</script>
