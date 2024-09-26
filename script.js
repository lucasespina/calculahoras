document.addEventListener('DOMContentLoaded', function () {
    const tableBody = document.getElementById('table-body');
    const totalHoursSpan = document.getElementById('total-hours');
    const clearButton = document.getElementById('clear-button');

    // Função para criar uma linha da tabela
    function createRow(day) {
        const row = document.createElement('tr');

        // Dia
        const dayCell = document.createElement('td');
        dayCell.textContent = day;
        dayCell.setAttribute('data-label', 'Dia');
        row.appendChild(dayCell);

        // Horário Inicial
        const startCell = document.createElement('td');
        const startInput = document.createElement('input');
        startInput.type = 'time';
        startInput.className = 'form-control';
        startInput.id = `start-${day}`;
        startInput.setAttribute('data-label', 'Horário Inicial');
        startCell.appendChild(startInput);
        row.appendChild(startCell);

        // Horário Final
        const endCell = document.createElement('td');
        const endInput = document.createElement('input');
        endInput.type = 'time';
        endInput.className = 'form-control';
        endInput.id = `end-${day}`;
        endInput.setAttribute('data-label', 'Horário Final');
        endCell.appendChild(endInput);
        row.appendChild(endCell);

        // Horário Inicial Pós Almoço
        const startAfternoonCell = document.createElement('td');
        const startAfternoonInput = document.createElement('input');
        startAfternoonInput.type = 'time';
        startAfternoonInput.className = 'form-control';
        startAfternoonInput.id = `start-afternoon-${day}`;
        startAfternoonInput.setAttribute('data-label', 'Horário Inicial Pós Almoço');
        startAfternoonCell.appendChild(startAfternoonInput);
        row.appendChild(startAfternoonCell);

        // Horário Final Pós Almoço
        const endAfternoonCell = document.createElement('td');
        const endAfternoonInput = document.createElement('input');
        endAfternoonInput.type = 'time';
        endAfternoonInput.className = 'form-control';
        endAfternoonInput.id = `end-afternoon-${day}`;
        endAfternoonInput.setAttribute('data-label', 'Horário Final Pós Almoço');
        endAfternoonCell.appendChild(endAfternoonInput);
        row.appendChild(endAfternoonCell);

        // Horas Totais do Dia
        const totalCell = document.createElement('td');
        totalCell.id = `total-${day}`;
        totalCell.className = 'total';
        totalCell.setAttribute('data-label', 'Horas Totais do Dia');
        row.appendChild(totalCell);

        // Adicionar event listeners
        [startInput, endInput, startAfternoonInput, endAfternoonInput].forEach(input => {
            input.addEventListener('change', () => {
                calculateDailyHours(day);
                saveTableData(day);
            });
        });

        tableBody.appendChild(row);
    }

    // Cria a tabela de dias
    for (let day = 1; day <= 31; day++) {
        createRow(day);
    }

    // Função para calcular as horas totais do dia
    function calculateDailyHours(day) {
        const startInput = document.getElementById(`start-${day}`).value;
        const endInput = document.getElementById(`end-${day}`).value;
        const startAfternoonInput = document.getElementById(`start-afternoon-${day}`).value;
        const endAfternoonInput = document.getElementById(`end-afternoon-${day}`).value;
        const totalCell = document.getElementById(`total-${day}`);

        let totalDayMinutes = 0;

        // Função auxiliar para calcular a diferença em minutos entre dois horários
        function calculateTimeDifference(startTime, endTime) {
            if (startTime && endTime) {
                const [startHours, startMinutes] = startTime.split(':').map(Number);
                const [endHours, endMinutes] = endTime.split(':').map(Number);

                const startInMinutes = startHours * 60 + startMinutes;
                const endInMinutes = endHours * 60 + endMinutes;

                return Math.max(endInMinutes - startInMinutes, 0); // Garantir que não haja valores negativos
            }
            return 0;
        }

        // Calcular as horas da manhã
        totalDayMinutes += calculateTimeDifference(startInput, endInput);

        // Calcular as horas da tarde
        totalDayMinutes += calculateTimeDifference(startAfternoonInput, endAfternoonInput);

        // Converter total de minutos para o formato HH:MM
        const totalDayHours = Math.floor(totalDayMinutes / 60);
        const totalDayMinutesLeft = totalDayMinutes % 60;
        totalCell.textContent = `${totalDayHours}:${totalDayMinutesLeft.toString().padStart(2, '0')}`;

        updateTotalHours();
    }

    // Função para atualizar o total de horas do mês
    function updateTotalHours() {
        let totalMinutes = 0;

        for (let day = 1; day <= 31; day++) {
            const totalCell = document.getElementById(`total-${day}`);
            if (totalCell.textContent) {
                const [hours, minutes] = totalCell.textContent.split(':').map(Number);
                totalMinutes += hours * 60 + minutes;
            }
        }

        const totalMonthHours = Math.floor(totalMinutes / 60);
        const totalMonthMinutes = totalMinutes % 60;
        totalHoursSpan.textContent = `${totalMonthHours}:${totalMonthMinutes.toString().padStart(2, '0')}`;
    }

    // Função para salvar os dados no localStorage
    function saveTableData(day) {
        const startInput = document.getElementById(`start-${day}`).value;
        const endInput = document.getElementById(`end-${day}`).value;
        const startAfternoonInput = document.getElementById(`start-afternoon-${day}`).value;
        const endAfternoonInput = document.getElementById(`end-afternoon-${day}`).value;

        localStorage.setItem(`start-${day}`, startInput);
        localStorage.setItem(`end-${day}`, endInput);
        localStorage.setItem(`start-afternoon-${day}`, startAfternoonInput);
        localStorage.setItem(`end-afternoon-${day}`, endAfternoonInput);
    }

    // Função para carregar dados do localStorage
    function loadTableData() {
        for (let day = 1; day <= 31; day++) {
            const startInput = document.getElementById(`start-${day}`);
            const endInput = document.getElementById(`end-${day}`);
            const startAfternoonInput = document.getElementById(`start-afternoon-${day}`);
            const endAfternoonInput = document.getElementById(`end-afternoon-${day}`);

            startInput.value = localStorage.getItem(`start-${day}`) || '';
            endInput.value = localStorage.getItem(`end-${day}`) || '';
            startAfternoonInput.value = localStorage.getItem(`start-afternoon-${day}`) || '';
            endAfternoonInput.value = localStorage.getItem(`end-afternoon-${day}`) || '';

            calculateDailyHours(day);
        }
    }

    // Função para limpar a tabela e o localStorage
    clearButton.addEventListener('click', () => {

            for (let day = 1; day <= 31; day++) {
                document.getElementById(`start-${day}`).value = '';
                document.getElementById(`end-${day}`).value = '';
                document.getElementById(`start-afternoon-${day}`).value = '';
                document.getElementById(`end-afternoon-${day}`).value = '';
                document.getElementById(`total-${day}`).textContent = '';

                // Remover do localStorage
                localStorage.removeItem(`start-${day}`);
                localStorage.removeItem(`end-${day}`);
                localStorage.removeItem(`start-afternoon-${day}`);
                localStorage.removeItem(`end-afternoon-${day}`);
            }
            updateTotalHours();
        
    });

    // Carrega os dados do localStorage ao iniciar
    loadTableData();
});
