let progressChart; // تعريف متغير عالمي للمخطط

// تحميل المهام من Local Storage وعرضها في الجدول عند فتح الصفحة
function loadTasks() {
    console.log("جاري تحميل المهام من Local Storage...");
    const tasks = JSON.parse(localStorage.getItem('tasks')) || [];

    // تنظيف الجدول قبل تحميل المهام لتجنب التكرار
    const tableBody = document.querySelector('#tasks-table tbody');
    tableBody.innerHTML = ''; 

    tasks.forEach(task => addTaskToTable(task)); // إضافة المهام الموجودة
    updateProgress(); // تحديث المخطط وشريط التقدم
}

// إضافة مهمة جديدة إلى Local Storage والجدول
function addTask() {
    const institution = document.getElementById('institution').value;
    const activity = document.getElementById('activity').value;
    const status = document.getElementById('status').value;
    const deadline = document.getElementById('deadline').value;

    if (institution && activity && deadline) {
        const task = { institution, activity, status, deadline };
        console.log("إضافة مهمة جديدة:", task);
        addTaskToTable(task);
        saveTask(task);

        // إعادة تعيين النموذج بعد الإضافة
        document.getElementById('institution').value = '';
        document.getElementById('activity').value = '';
        document.getElementById('status').value = 'not-started';
        document.getElementById('deadline').value = '';

        addNotification('تمت إضافة مهمة جديدة: ' + activity);
        updateProgress();
    } else {
        alert('يرجى إدخال جميع البيانات المطلوبة!');
    }
}

// إضافة مهمة إلى الجدول
function addTaskToTable(task) {
    const table = document.querySelector('#tasks-table tbody');
    const row = document.createElement('tr');

    const statusClass = task.status === 'not-started' ? 'not-started' :
                        task.status === 'in-progress' ? 'in-progress' : 'completed';

    row.innerHTML = `
        <td>${task.institution}</td>
        <td>${task.activity}</td>
        <td><span class="status ${statusClass}" onclick="updateTask(this)">${getStatusText(task.status)}</span></td>
        <td>${task.deadline}</td>
    `;
    table.appendChild(row);
}

// حفظ المهمة في Local Storage
function saveTask(task) {
    const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    tasks.push(task);
    localStorage.setItem('tasks', JSON.stringify(tasks));
}

// تحديث شريط التقدم، المخطط البياني، ومؤشرات الأداء (KPIs)
function updateProgress() {
    console.log("جاري تحديث مؤشرات الأداء...");
    const tasks = JSON.parse(localStorage.getItem('tasks')) || [];

    // حساب عدد المهام بناءً على حالتها
    let completed = tasks.filter(task => task.status === 'completed').length;
    let inProgress = tasks.filter(task => task.status === 'in-progress').length;
    let notStarted = tasks.filter(task => task.status === 'not-started').length;

    console.log(`المهام: مكتمل=${completed}, قيد التنفيذ=${inProgress}, لم يبدأ=${notStarted}`);

    // حساب العدد الإجمالي للمهام ونسبة الإنجاز
    const total = tasks.length;
    const overallProgress = total ? Math.floor((completed / total) * 100) : 0;

    // تحديث مؤشرات الأداء الرئيسية (KPIs)
    document.getElementById('project-count').innerText = total;
    document.getElementById('overall-progress').innerText = `${overallProgress}%`;

    // تحديث المخطط البياني
    initializeChart([completed, inProgress, notStarted]);
}

// إعداد المخطط البياني باستخدام Chart.js
function initializeChart(data) {
    const ctx = document.getElementById('progressChart').getContext('2d');

    if (progressChart) {
        progressChart.destroy();
    }

    progressChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: ['مكتمل', 'قيد التنفيذ', 'لم يبدأ'],
            datasets: [{
                label: 'عدد المهام',
                data: data,
                backgroundColor: ['#5bc0de', '#f0ad4e', '#d9534f'],
            }]
        },
        options: {
            responsive: true,
            plugins: {
                legend: {
                    display: true,
                    position: 'bottom',
                }
            }
        }
    });
    console.log("تم إنشاء المخطط بنجاح.");
}

// تحديث حالة المهمة عند النقر
function updateTask(element) {
    const status = element.classList.contains('not-started') ? 'in-progress' :
                   element.classList.contains('in-progress') ? 'completed' : 'not-started';

    element.className = `status ${status}`;
    element.innerText = getStatusText(status);
    saveAllTasks();
    addNotification('تم تحديث حالة مهمة إلى: ' + element.innerText);
    updateProgress();
}

// حفظ جميع المهام بعد تحديث حالة مهمة
function saveAllTasks() {
    const tasks = [];
    document.querySelectorAll('#tasks-table tbody tr').forEach(row => {
        const institution = row.cells[0].innerText;
        const activity = row.cells[1].innerText;
        const status = row.cells[2].querySelector('.status').classList[1];
        const deadline = row.cells[3].innerText;
        tasks.push({ institution, activity, status, deadline });
    });
    localStorage.setItem('tasks', JSON.stringify(tasks));
}

// تحويل حالة المهمة من رمز إلى نص
function getStatusText(status) {
    switch (status) {
        case 'not-started': return 'لم يبدأ';
        case 'in-progress': return 'قيد التنفيذ';
        case 'completed': return 'مكتمل';
        default: return '';
    }
}

// إضافة إشعار جديد
function addNotification(message) {
    const notificationArea = document.getElementById('notification-area');
    const notification = document.createElement('div');
    notification.innerText = message;
    notificationArea.appendChild(notification);
}

// تحميل المهام عند فتح الصفحة
window.onload = function () {
    loadTasks();
};




