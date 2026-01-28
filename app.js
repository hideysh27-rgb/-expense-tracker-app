document.addEventListener('DOMContentLoaded', () => {
    // DOM要素の取得
    const expenseForm = document.getElementById('expense-form');
    const categoryInput = document.getElementById('category');
    const amountInput = document.getElementById('amount');
    const dateInput = document.getElementById('date');
    const memoInput = document.getElementById('memo');
    const expenseList = document.getElementById('expense-list');
    const totalExpensesEl = document.getElementById('total-expenses');

    // --- データストレージ関連の関数 ---

    /**
     * localStorageから支出データの配列を取得します。
     * @returns {Array<Object>} 支出オブジェクトの配列
     */
    function getExpensesFromStorage() {
        const expensesJSON = localStorage.getItem('expenses');
        try {
            const expenses = JSON.parse(expensesJSON);
            return Array.isArray(expenses) ? expenses : [];
        } catch (e) {
            console.error('localStorageからのデータ読み込みに失敗しました:', e);
            return [];
        }
    }

    /**
     * 支出データの配列をlocalStorageに保存します。
     * @param {Array<Object>} expenses - 保存する支出オブジェクトの配列
     */
    function saveExpensesToStorage(expenses) {
        localStorage.setItem('expenses', JSON.stringify(expenses));
    }

    // --- UI関連の関数 ---

    /**
     * 支出リストと合計金額を画面に描画します。
     */
    function renderUI() {
        const expenses = getExpensesFromStorage();
        
        // リストをクリア
        expenseList.innerHTML = '';

        let total = 0;

        if (expenses.length === 0) {
            expenseList.innerHTML = '<li>支出はまだありません。</li>';
        } else {
            expenses.forEach(expense => {
                const li = document.createElement('li');
                
                // 通貨形式にフォーマット
                const amountFormatted = `￥${expense.amount.toLocaleString()}`;

                li.innerHTML = `
                    <div class="expense-item-content">
                        <span class="expense-date">${expense.date}</span>
                        <span class="expense-category">${expense.category}</span>
                        <span class="expense-memo">${expense.memo || ''}</span>
                        <span class="expense-amount">${amountFormatted}</span>
                    </div>
                    <button class="delete-btn" data-id="${expense.id}">削除</button>
                `;
                expenseList.appendChild(li);

                total += expense.amount;
            });
        }
        
        // 合計金額を更新
        totalExpensesEl.textContent = total.toLocaleString();
    }


    // --- イベントハンドラ ---

    /**
     * フォーム送信時の処理
     */
    function handleFormSubmit(event) {
        event.preventDefault();

        const category = categoryInput.value;
        const amount = parseInt(amountInput.value, 10);
        const date = dateInput.value;
        const memo = memoInput.value;

        if (!category || !amount || amount <= 0 || !date) {
            alert('カテゴリ、金額、日付を正しく入力してください。');
            return;
        }

        const newExpense = {
            id: Date.now(),
            category,
            amount,
            date,
            memo
        };

        const expenses = getExpensesFromStorage();
        expenses.unshift(newExpense); // 新しいものを先頭に
        saveExpensesToStorage(expenses);

        renderUI();

        // フォームをリセット
        expenseForm.reset();
        // 日付は今日の日付に再設定
        dateInput.value = new Date().toISOString().split('T')[0];
    }
    
    /**
     * 削除ボタンクリック時の処理（イベントデリゲーション）
     */
    function handleDeleteClick(event) {
        if (event.target.classList.contains('delete-btn')) {
            const idToDelete = Number(event.target.getAttribute('data-id'));
            
            let expenses = getExpensesFromStorage();
            expenses = expenses.filter(expense => expense.id !== idToDelete);
            saveExpensesToStorage(expenses);

            renderUI();
        }
    }

    // --- 初期化処理 ---

    function init() {
        // 日付入力のデフォルト値を今日に設定
        dateInput.value = new Date().toISOString().split('T')[0];

        // イベントリスナーを設定
        expenseForm.addEventListener('submit', handleFormSubmit);
        expenseList.addEventListener('click', handleDeleteClick);

        // アプリケーションの初期描画
        renderUI();
    }

    // アプリケーションの開始
    init();
});