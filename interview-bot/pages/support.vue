<template>
    <div class="flex flex-col items-center h-screen bg-gray-300">
        <div class="w-1/2 bg-white p-8 rounded shadow mb-8 mx-auto">
            <form @submit.prevent="submit">
                <div class="mb-4">
                    <label class="block text-gray-700 text-sm font-bold mb-2">Account ID</label>
                    <input class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-800 leading-tight focus:outline-none focus:shadow-outline" type="text" v-model="accountId" disabled>
                </div>
                <div class="mb-4">
                    <label class="block text-gray-800 text-sm font-bold mb-2">Subject</label>
                    <input class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-800 leading-tight focus:outline-none focus:shadow-outline" type="text" v-model="subject">
                </div>
                <div class="mb-4">
                    <label class="block text-gray-700 text-sm font-bold mb-2">Case Number</label>
                    <input class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-800 leading-tight focus:outline-none focus:shadow-outline" type="text" v-model="caseNumber" disabled>
                </div>
                <div class="mb-4">
                    <label class="block text-gray-800 text-sm font-bold mb-2">Severity</label>
                    <div class="inline-block relative w-64">
                        <select v-model="severity" class="block appearance-none w-full bg-white border border-gray-400 hover:border-gray-500 px-4 py-2 pr-8 rounded shadow leading-tight focus:outline-none focus:shadow-outline">
                            <option>High</option>
                            <option>Medium</option>
                            <option>Low</option>
                        </select>
                    </div>
                </div>
                <div>
                    <label class="block text-gray-800 text-sm font-bold mb-2">Details</label>
                    <textarea class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-800 leading-tight focus:outline-none focus:shadow-outline" v-model="details" rows="6"></textarea>
                </div>
                <div class="flex justify-end mt-4">
                    <button class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mr-2" type="submit">Submit</button>
                    <button class="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded" type="button" @click="discard">Discard</button>
                </div>
            </form>
        </div>

        <!-- Case History Section -->
    <div class="w-1/2 bg-white p-8 rounded shadow mb-8 mx-auto" style="height: 50vh; overflow-y: auto;">
        <h2 class="text-lg font-semibold mb-4">Case History</h2>
        <div v-for="supportCase in caseHistory" :key="supportCase.id" class="border p-4 mb-4 cursor-pointer" @click="openCase(supportCase)">
        <h3 class="font-semibold text-blue-500 mb-2">{{ supportCase.subject }}</h3>
        <p>{{ supportCase.overview }}</p>
    </div>

    <!-- Case Details Modal -->
    <div v-if="selectedCase" class="fixed top-0 left-0 w-full h-full flex items-center justify-center z-50" style="background-color: rgba(0,0,0,0.5);">
        <div class="bg-white p-8 w-1/2 h-auto max-h-3/4 overflow-auto">
            <h2 class="text-lg font-semibold mb-4">Case Details</h2>
            <p>{{ selectedCase.details }}</p>
            <button class="mt-4 bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded" @click="selectedCase = null">Close</button>
        </div>
       </div>
      </div>
    </div>
</template>

<script>
export default {
    data() {
        return {
            // Existing data properties
            accountId: '12345', // Dummy account ID
            caseNumber: '67890', // Dummy case number
            caseHistory: [
                { id: 1, subject: 'Case 1', overview: 'Case 1 overview...', details: 'Full case 1 details...' },
                { id: 2, subject: 'Case 2', overview: 'Case 2 overview...', details: 'Full case 2 details...' }
            ],
            selectedCase: null
        };
    },
    methods: {
        // Existing methods
        openCase(caseItem) {
            this.selectedCase = caseItem;
        }
    }
}
</script>