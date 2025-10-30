// Main Application Module
// Handles UI interactions and page navigation

// Placeholder functions for user and request management
const currentUser = null
function handleLogin(username, password) {
  // Placeholder implementation
  return { success: true, user: { id: 1, name: "John Doe", role: "admin" } }
}

function getRoleText(role) {
  // Placeholder implementation
  return role === "admin" ? "ผู้ดูแลระบบ" : role === "it" ? "พนักงาน IT" : "ผู้ใช้"
}

function handleRegister(userData) {
  // Placeholder implementation
  return { success: true, message: "การสมัครสมาชิกสำเร็จ" }
}

function addRequest(newRequest) {
  // Placeholder implementation
  console.log("Request added:", newRequest)
}

function getRequests() {
  // Placeholder implementation
  return []
}

function getUsers() {
  // Placeholder implementation
  return []
}

function isAdminOrIT() {
  // Placeholder implementation
  return currentUser.role === "admin" || currentUser.role === "it"
}

function updateRequest(requestId, updates) {
  // Placeholder implementation
  console.log("Request updated:", requestId, updates)
}

function getEquipment() {
  // Placeholder implementation
  return []
}

function getDepartments() {
  // Placeholder implementation
  return []
}

function deleteUser(userId) {
  // Placeholder implementation
  console.log("User deleted:", userId)
}

function deleteEquipment(equipmentId) {
  // Placeholder implementation
  console.log("Equipment deleted:", equipmentId)
}

// Page navigation
function showPage(pageId) {
  document.querySelectorAll(".page").forEach((page) => {
    page.classList.remove("active")
  })
  document.getElementById(pageId).classList.add("active")
}

// Section navigation
function showSection(sectionId) {
  document.querySelectorAll(".section").forEach((section) => {
    section.style.display = "none"
  })
  document.getElementById(sectionId).style.display = "block"

  document.querySelectorAll(".sidebar-link").forEach((link) => {
    link.classList.remove("active")
  })
  const activeLink = document.querySelector(`[data-section="${sectionId}"]`)
  if (activeLink) {
    activeLink.classList.add("active")
  }

  // Load data for specific sections
  if (sectionId === "trackStatus") {
    loadRequestsList()
  } else if (sectionId === "history") {
    loadHistoryTable()
  } else if (sectionId === "adminDashboard") {
    loadAdminDashboard()
  } else if (sectionId === "manageUsers") {
    loadUsersTable()
  } else if (sectionId === "manageEquipment") {
    loadEquipmentTable()
  }
}

// Login form handler
document.getElementById("loginForm").addEventListener("submit", (e) => {
  e.preventDefault()
  const username = document.getElementById("loginUsername").value
  const password = document.getElementById("loginPassword").value

  const result = handleLogin(username, password)

  if (result.success) {
    document.getElementById("userDisplayName").textContent = result.user.name
    document.getElementById("userRole").textContent = getRoleText(result.user.role)

    if (result.user.role === "admin" || result.user.role === "it") {
      document.getElementById("adminMenu").style.display = "block"
    }

    showPage("mainApp")
    updateDashboard()
    loadRecentRequests()
  } else {
    alert(result.message)
  }
})

// Register form handler
document.getElementById("registerForm").addEventListener("submit", (e) => {
  e.preventDefault()

  const userData = {
    username: document.getElementById("regUsername").value,
    password: document.getElementById("regPassword").value,
    name: document.getElementById("regName").value,
    tel: document.getElementById("regTel").value,
    email: document.getElementById("regEmail").value,
    department: document.getElementById("regDepartment").value,
  }

  const result = handleRegister(userData)

  if (result.success) {
    alert(result.message + "! กรุณาเข้าสู่ระบบ")
    showPage("loginPage")
    document.getElementById("registerForm").reset()
  } else {
    alert(result.message)
  }
})

// Request form handler
document.getElementById("requestForm").addEventListener("submit", (e) => {
  e.preventDefault()

  const newRequest = {
    userId: currentUser.id,
    equipmentType: document.getElementById("equipmentType").value,
    assetNo: document.getElementById("assetNo").value,
    subject: document.getElementById("requestSubject").value,
    detail: document.getElementById("requestDetail").value,
    priority: document.getElementById("priority").value,
    location: document.getElementById("location").value,
    status: "รอรับงาน",
    date: new Date().toISOString(),
    assignedTo: null,
  }

  addRequest(newRequest)
  alert("ส่งคำขอแจ้งซ่อมเรียบร้อยแล้ว")
  document.getElementById("requestForm").reset()
  updateDashboard()
  loadRecentRequests()
})

// Update dashboard statistics
function updateDashboard() {
  const allRequests = getRequests()
  const userRequests =
    currentUser.role === "user" ? allRequests.filter((r) => r.userId === currentUser.id) : allRequests

  const pending = userRequests.filter((r) => r.status === "รอรับงาน").length
  const inProgress = userRequests.filter((r) => r.status === "กำลังดำเนินการ").length
  const completed = userRequests.filter((r) => r.status === "เสร็จสิ้น").length

  document.getElementById("pendingCount").textContent = pending
  document.getElementById("inProgressCount").textContent = inProgress
  document.getElementById("completedCount").textContent = completed
}

// Load recent requests
function loadRecentRequests() {
  const allRequests = getRequests()
  const allUsers = getUsers()
  const userRequests =
    currentUser.role === "user" ? allRequests.filter((r) => r.userId === currentUser.id) : allRequests

  const recentRequests = userRequests.slice(-5).reverse()
  const container = document.getElementById("recentRequests")

  if (recentRequests.length === 0) {
    container.innerHTML = '<p class="text-gray-500 text-center py-8">ยังไม่มีรายการแจ้งซ่อม</p>'
    return
  }

  container.innerHTML = recentRequests
    .map((req) => {
      const user = allUsers.find((u) => u.id === req.userId)
      const statusClass =
        req.status === "รอรับงาน"
          ? "status-pending"
          : req.status === "กำลังดำเนินการ"
            ? "status-in-progress"
            : "status-completed"

      return `
            <div class="border border-gray-200 rounded-lg p-4 hover:shadow-md transition duration-200">
                <div class="flex justify-between items-start mb-2">
                    <h4 class="font-semibold text-gray-800">${req.subject}</h4>
                    <span class="status-badge ${statusClass}">${req.status}</span>
                </div>
                <p class="text-sm text-gray-600 mb-2">${req.detail.substring(0, 100)}...</p>
                <div class="flex justify-between items-center text-xs text-gray-500">
                    <span><i class="fas fa-user mr-1"></i>${user.name}</span>
                    <span><i class="fas fa-calendar mr-1"></i>${new Date(req.date).toLocaleDateString("th-TH")}</span>
                </div>
            </div>
        `
    })
    .join("")
}

// Load requests list with filters
function loadRequestsList() {
  const allRequests = getRequests()
  const allUsers = getUsers()
  const userRequests =
    currentUser.role === "user" ? allRequests.filter((r) => r.userId === currentUser.id) : allRequests

  const container = document.getElementById("requestsList")

  if (userRequests.length === 0) {
    container.innerHTML = '<p class="text-gray-500 text-center py-8">ไม่พบรายการแจ้งซ่อม</p>'
    return
  }

  container.innerHTML = userRequests
    .reverse()
    .map((req) => {
      const user = allUsers.find((u) => u.id === req.userId)
      const statusClass =
        req.status === "รอรับงาน"
          ? "status-pending"
          : req.status === "กำลังดำเนินการ"
            ? "status-in-progress"
            : "status-completed"

      return `
            <div class="border border-gray-200 rounded-lg p-6 hover:shadow-lg transition duration-200">
                <div class="flex justify-between items-start mb-4">
                    <div>
                        <h4 class="text-lg font-bold text-gray-800 mb-1">${req.subject}</h4>
                        <p class="text-sm text-gray-500">รหัส: REQ-${String(req.id).padStart(4, "0")}</p>
                    </div>
                    <span class="status-badge ${statusClass}">${req.status}</span>
                </div>
                
                <div class="grid grid-cols-2 gap-4 mb-4 text-sm">
                    <div>
                        <span class="text-gray-600">ประเภท:</span>
                        <span class="font-medium ml-2">${req.equipmentType}</span>
                    </div>
                    <div>
                        <span class="text-gray-600">ความเร่งด่วน:</span>
                        <span class="font-medium ml-2">${req.priority}</span>
                    </div>
                    <div>
                        <span class="text-gray-600">ผู้แจ้ง:</span>
                        <span class="font-medium ml-2">${user.name}</span>
                    </div>
                    <div>
                        <span class="text-gray-600">วันที่แจ้ง:</span>
                        <span class="font-medium ml-2">${new Date(req.date).toLocaleDateString("th-TH")}</span>
                    </div>
                </div>
                
                <p class="text-gray-700 mb-4">${req.detail}</p>
                
                ${
                  isAdminOrIT()
                    ? `
                    <div class="flex gap-2">
                        <button onclick="updateRequestStatus(${req.id}, 'กำลังดำเนินการ')" class="flex-1 bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition duration-200">
                            <i class="fas fa-play mr-2"></i>เริ่มดำเนินการ
                        </button>
                        <button onclick="updateRequestStatus(${req.id}, 'เสร็จสิ้น')" class="flex-1 bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition duration-200">
                            <i class="fas fa-check mr-2"></i>ปิดงาน
                        </button>
                    </div>
                `
                    : ""
                }
            </div>
        `
    })
    .join("")
}

// Update request status
function updateRequestStatus(requestId, newStatus) {
  const updates = { status: newStatus }

  if (newStatus === "กำลังดำเนินการ") {
    const request = getRequests().find((r) => r.id === requestId)
    if (request && !request.assignedTo) {
      updates.assignedTo = currentUser.id
    }
  }

  updateRequest(requestId, updates)
  loadRequestsList()
  updateDashboard()
  loadRecentRequests()
  alert(`อัพเดตสถานะเป็น "${newStatus}" เรียบร้อยแล้ว`)
}

// Filter requests
function filterRequests() {
  const statusFilter = document.getElementById("statusFilter").value
  const searchText = document.getElementById("searchRequest").value.toLowerCase()
  const allRequests = getRequests()
  const allUsers = getUsers()

  let filtered = currentUser.role === "user" ? allRequests.filter((r) => r.userId === currentUser.id) : allRequests

  if (statusFilter) {
    filtered = filtered.filter((r) => r.status === statusFilter)
  }

  if (searchText) {
    filtered = filtered.filter(
      (r) => r.subject.toLowerCase().includes(searchText) || r.detail.toLowerCase().includes(searchText),
    )
  }

  const container = document.getElementById("requestsList")

  if (filtered.length === 0) {
    container.innerHTML = '<p class="text-gray-500 text-center py-8">ไม่พบรายการที่ค้นหา</p>'
    return
  }

  container.innerHTML = filtered
    .reverse()
    .map((req) => {
      const user = allUsers.find((u) => u.id === req.userId)
      const statusClass =
        req.status === "รอรับงาน"
          ? "status-pending"
          : req.status === "กำลังดำเนินการ"
            ? "status-in-progress"
            : "status-completed"

      return `
            <div class="border border-gray-200 rounded-lg p-6 hover:shadow-lg transition duration-200">
                <div class="flex justify-between items-start mb-4">
                    <div>
                        <h4 class="text-lg font-bold text-gray-800 mb-1">${req.subject}</h4>
                        <p class="text-sm text-gray-500">รหัส: REQ-${String(req.id).padStart(4, "0")}</p>
                    </div>
                    <span class="status-badge ${statusClass}">${req.status}</span>
                </div>
                
                <div class="grid grid-cols-2 gap-4 mb-4 text-sm">
                    <div>
                        <span class="text-gray-600">ประเภท:</span>
                        <span class="font-medium ml-2">${req.equipmentType}</span>
                    </div>
                    <div>
                        <span class="text-gray-600">ความเร่งด่วน:</span>
                        <span class="font-medium ml-2">${req.priority}</span>
                    </div>
                    <div>
                        <span class="text-gray-600">ผู้แจ้ง:</span>
                        <span class="font-medium ml-2">${user.name}</span>
                    </div>
                    <div>
                        <span class="text-gray-600">วันที่แจ้ง:</span>
                        <span class="font-medium ml-2">${new Date(req.date).toLocaleDateString("th-TH")}</span>
                    </div>
                </div>
                
                <p class="text-gray-700 mb-4">${req.detail}</p>
            </div>
        `
    })
    .join("")
}

// Load history table
function loadHistoryTable() {
  const allRequests = getRequests()
  const userRequests =
    currentUser.role === "user" ? allRequests.filter((r) => r.userId === currentUser.id) : allRequests

  const tbody = document.getElementById("historyTableBody")

  if (userRequests.length === 0) {
    tbody.innerHTML = '<tr><td colspan="6" class="px-6 py-8 text-center text-gray-500">ไม่มีประวัติการแจ้งซ่อม</td></tr>'
    return
  }

  tbody.innerHTML = userRequests
    .reverse()
    .map((req) => {
      const statusClass =
        req.status === "รอรับงาน"
          ? "status-pending"
          : req.status === "กำลังดำเนินการ"
            ? "status-in-progress"
            : "status-completed"

      return `
            <tr class="hover:bg-gray-50">
                <td class="px-6 py-4 text-sm">REQ-${String(req.id).padStart(4, "0")}</td>
                <td class="px-6 py-4 text-sm">${new Date(req.date).toLocaleDateString("th-TH")}</td>
                <td class="px-6 py-4 text-sm font-medium">${req.subject}</td>
                <td class="px-6 py-4 text-sm">${req.equipmentType}</td>
                <td class="px-6 py-4"><span class="status-badge ${statusClass}">${req.status}</span></td>
                <td class="px-6 py-4">
                    <button onclick="viewRequestDetail(${req.id})" class="text-blue-600 hover:text-blue-800">
                        <i class="fas fa-eye"></i>
                    </button>
                </td>
            </tr>
        `
    })
    .join("")
}

// View request detail
function viewRequestDetail(requestId) {
  const allRequests = getRequests()
  const allUsers = getUsers()
  const request = allRequests.find((r) => r.id === requestId)

  if (request) {
    const user = allUsers.find((u) => u.id === request.userId)
    alert(
      `รายละเอียดคำขอ\n\nรหัส: REQ-${String(request.id).padStart(4, "0")}\nหัวข้อ: ${request.subject}\nรายละเอียด: ${request.detail}\nผู้แจ้ง: ${user.name}\nสถานะ: ${request.status}`,
    )
  }
}

// Load admin dashboard
function loadAdminDashboard() {
  const allUsers = getUsers()
  const allRequests = getRequests()
  const allEquipment = getEquipment()

  document.getElementById("totalUsers").textContent = allUsers.length
  document.getElementById("totalRequests").textContent = allRequests.length
  document.getElementById("totalEquipment").textContent = allEquipment.length
  document.getElementById("avgTime").textContent = "4.5"

  // Equipment stats
  const equipmentTypes = {}
  allRequests.forEach((req) => {
    equipmentTypes[req.equipmentType] = (equipmentTypes[req.equipmentType] || 0) + 1
  })

  const equipmentStatsHtml = Object.entries(equipmentTypes)
    .map(([type, count]) => {
      const percentage = ((count / allRequests.length) * 100).toFixed(1)
      return `
            <div>
                <div class="flex justify-between mb-1">
                    <span class="text-sm font-medium text-gray-700">${type}</span>
                    <span class="text-sm text-gray-600">${count} รายการ (${percentage}%)</span>
                </div>
                <div class="w-full bg-gray-200 rounded-full h-2">
                    <div class="bg-blue-600 h-2 rounded-full" style="width: ${percentage}%"></div>
                </div>
            </div>
        `
    })
    .join("")

  document.getElementById("equipmentStats").innerHTML = equipmentStatsHtml || '<p class="text-gray-500">ไม่มีข้อมูล</p>'

  // Staff performance
  const itStaff = allUsers.filter((u) => u.role === "it" || u.role === "admin")
  const performanceHtml = itStaff
    .map((staff) => {
      const assignedRequests = allRequests.filter((r) => r.assignedTo === staff.id)
      const completedRequests = assignedRequests.filter((r) => r.status === "เสร็จสิ้น")
      const completionRate =
        assignedRequests.length > 0 ? ((completedRequests.length / assignedRequests.length) * 100).toFixed(1) : 0

      return `
            <div>
                <div class="flex justify-between mb-1">
                    <span class="text-sm font-medium text-gray-700">${staff.name}</span>
                    <span class="text-sm text-gray-600">${completedRequests.length}/${assignedRequests.length} (${completionRate}%)</span>
                </div>
                <div class="w-full bg-gray-200 rounded-full h-2">
                    <div class="bg-green-600 h-2 rounded-full" style="width: ${completionRate}%"></div>
                </div>
            </div>
        `
    })
    .join("")

  document.getElementById("staffPerformance").innerHTML = performanceHtml || '<p class="text-gray-500">ไม่มีข้อมูล</p>'
}

// Load users table
function loadUsersTable() {
  const allUsers = getUsers()
  const allDepartments = getDepartments()
  const tbody = document.getElementById("usersTableBody")

  tbody.innerHTML = allUsers
    .map((user) => {
      const dept = allDepartments.find((d) => d.id === user.department)
      const roleText = getRoleText(user.role)

      return `
            <tr class="hover:bg-gray-50">
                <td class="px-6 py-4 text-sm">${user.username}</td>
                <td class="px-6 py-4 text-sm">${user.name}</td>
                <td class="px-6 py-4 text-sm">${roleText}</td>
                <td class="px-6 py-4 text-sm">${dept ? dept.name : "-"}</td>
                <td class="px-6 py-4">
                    <button onclick="editUser(${user.id})" class="text-blue-600 hover:text-blue-800 mr-3">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button onclick="deleteUserHandler(${user.id})" class="text-red-600 hover:text-red-800">
                        <i class="fas fa-trash"></i>
                    </button>
                </td>
            </tr>
        `
    })
    .join("")
}

// Load equipment table
function loadEquipmentTable() {
  const allEquipment = getEquipment()
  const allDepartments = getDepartments()
  const tbody = document.getElementById("equipmentTableBody")

  tbody.innerHTML = allEquipment
    .map((eq) => {
      const dept = allDepartments.find((d) => d.id === eq.department)

      return `
            <tr class="hover:bg-gray-50">
                <td class="px-6 py-4 text-sm">${eq.assetNo}</td>
                <td class="px-6 py-4 text-sm">${eq.name}</td>
                <td class="px-6 py-4 text-sm">${eq.type}</td>
                <td class="px-6 py-4 text-sm">${dept ? dept.name : "-"}</td>
                <td class="px-6 py-4">
                    <button onclick="editEquipment(${eq.id})" class="text-blue-600 hover:text-blue-800 mr-3">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button onclick="deleteEquipmentHandler(${eq.id})" class="text-red-600 hover:text-red-800">
                        <i class="fas fa-trash"></i>
                    </button>
                </td>
            </tr>
        `
    })
    .join("")
}

// Placeholder functions for modals
function showAddUserModal() {
  alert("ฟังก์ชันเพิ่มผู้ใช้ (ในระบบจริงจะเป็น Modal)")
}

function editUser(userId) {
  alert(`แก้ไขผู้ใช้ ID: ${userId}`)
}

function deleteUserHandler(userId) {
  if (confirm("ต้องการลบผู้ใช้นี้หรือไม่?")) {
    deleteUser(userId)
    loadUsersTable()
  }
}

function showAddEquipmentModal() {
  alert("ฟังก์ชันเพิ่มครุภัณฑ์ (ในระบบจริงจะเป็น Modal)")
}

function editEquipment(equipmentId) {
  alert(`แก้ไขครุภัณฑ์ ID: ${equipmentId}`)
}

function deleteEquipmentHandler(equipmentId) {
  if (confirm("ต้องการลบครุภัณฑ์นี้หรือไม่?")) {
    deleteEquipment(equipmentId)
    loadEquipmentTable()
  }
}
