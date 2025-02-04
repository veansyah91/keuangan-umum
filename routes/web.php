
<?php

use Inertia\Inertia;
use Illuminate\Support\Facades\Route;
use Illuminate\Foundation\Application;
use App\Http\Controllers\LogController;
use App\Http\Controllers\DebtController;
use App\Http\Controllers\AddonsController;
use App\Http\Controllers\CashinController;
use App\Http\Controllers\ReportController;
use App\Http\Controllers\SavingController;
use App\Http\Controllers\AccountController;
use App\Http\Controllers\CashoutController;
use App\Http\Controllers\ContactController;
use App\Http\Controllers\JournalController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\ProgramController;
use App\Http\Controllers\ProjectController;
use App\Http\Controllers\CashflowController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\Admin\MenuController;
use App\Http\Controllers\Admin\PageController;
use App\Http\Controllers\DataLedgerController;
use App\Http\Controllers\DataMasterController;
use App\Http\Controllers\DepartmentController;
use App\Http\Controllers\FixedAssetController;
use App\Http\Controllers\AffiliationController;
use App\Http\Controllers\MenuSettingController;
use App\Http\Controllers\SavingDebitController;
use App\Http\Controllers\AccountStaffController;
use App\Http\Controllers\CashMutationController;
use App\Http\Controllers\OrganizationController;
use App\Http\Controllers\SavingCreditController;
use App\Http\Controllers\SavingLedgerController;
use App\Http\Controllers\StaffContactController;
use App\Http\Controllers\StudentLevelController;
use App\Http\Controllers\AccountSchoolController;
use App\Http\Controllers\Admin\RegencyController;
use App\Http\Controllers\Admin\VillageController;
use App\Http\Controllers\SavingBalanceController;
use App\Http\Controllers\Admin\DistrictController;
use App\Http\Controllers\Admin\ProvinceController;
use App\Http\Controllers\SalaryCategoryController;
use App\Http\Controllers\SavingCategoryController;
use App\Http\Controllers\StudentContactController;
use App\Http\Controllers\AccountCategoryController;
use App\Http\Controllers\Admin\AdminUserController;
use App\Http\Controllers\ContactCategoryController;
use App\Http\Controllers\Admin\UserMasterController;
use App\Http\Controllers\Admin\AdminAddonsController;
use App\Http\Controllers\Admin\AdminMasterController;
use App\Http\Controllers\Admin\UserWithdrawController;
use App\Http\Controllers\FixedAssetCategoryController;
use App\Http\Controllers\StaffSalaryPaymentController;
use App\Http\Controllers\OrganizationInvoiceController;
use App\Http\Controllers\StudentEntryPaymentController;
use App\Http\Controllers\WhatsappLogActivityController;
use App\Http\Controllers\Admin\AdminDashboardController;
use App\Http\Controllers\WhatsappBroadcastingController;
use App\Http\Controllers\StudentMonthlyPaymentController;
use App\Http\Controllers\Admin\OrganizationMenuController;
use App\Http\Controllers\StudentEntryReceivableController;
use App\Http\Controllers\StudentPaymentCategoryController;
use App\Http\Controllers\Admin\AdminOrganizationController;
use App\Http\Controllers\StudentMonthlyReceivableController;
use App\Http\Controllers\StudentEntryPaymentCategoryController;
use App\Http\Controllers\WhatsappBroadcastingInvoiceController;
use App\Http\Controllers\StudentEntryReceivablePaymentController;
use App\Http\Controllers\Admin\AdminOrganizationInvoiceController;
use App\Http\Controllers\Admin\AdminWhatsappBroadcastingController;
use App\Http\Controllers\Admin\AdminWhatsappBroadcastingDataController;
use App\Http\Controllers\Admin\AdminWhatsappBroadcastingInvoiceController;

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| contains the "web" middleware group. Now create something great!
|
*/

Route::get('/', function () {
    return redirect(route('organization'));

    return Inertia::render('Welcome', [
        'canLogin' => Route::has('login'),
        'canRegister' => Route::has('register'),
        'laravelVersion' => Application::VERSION,
        'phpVersion' => PHP_VERSION,
    ]);
});

Route::middleware(['auth', 'verified'])->group(function () {
	// Admin
	Route::middleware('is.admin')->group(function () {
		//prefix ADMIN
		Route::prefix('admin')->group(function () {
			// Dashboard
			Route::get('/dashboard', [AdminDashboardController::class, 'index'])->name('admin.dashboard');

			// Data Master
			Route::get('/data-master', AdminMasterController::class)->name('admin.data-master');

			// Data Regional
			Route::get('/data-master/provinces', [ProvinceController::class, 'index'])->name('admin.data-master.province');
			Route::post('/data-master/provinces', [ProvinceController::class, 'post'])->name('admin.data-master.province.post');

			Route::get('/data-master/regencies', [RegencyController::class, 'index'])->name('admin.data-master.regency');
			Route::post('/data-master/regencies', [RegencyController::class, 'post'])->name('admin.data-master.regency.post');

			Route::get('/data-master/districts', [DistrictController::class, 'index'])->name('admin.data-master.district');
			Route::post('/data-master/districts', [DistrictController::class, 'post'])->name('admin.data-master.district.post');

			Route::get('/data-master/villages', [VillageController::class, 'index'])->name('admin.data-master.village');
			Route::post('/data-master/villages', [VillageController::class, 'post'])->name('admin.data-master.village.post');

			Route::get('/data-master/pages', [PageController::class, 'index'])->name('admin.data-master.page');
			Route::get('/data-master/menus', MenuController::class)->name('admin.data-master.menu');

			// User Master
			Route::get('/user-master', UserMasterController::class)->name('admin.user-master');

			// Users
			Route::get('/users', [AdminUserController::class, 'index'])->name('admin.user-master.users');
			Route::patch('/users/{user}/affiliation', [AdminUserController::class, 'storeAffiliation'])->name('admin.user.store.affiliation');

			// User Affiliation
			Route::get('/users/withdraws', [UserWithdrawController::class, 'index'])->name('admin.user-master.withdraws');
			Route::patch('/users/withdraws/{withdraw}', [UserWithdrawController::class, 'update'])->name('admin.user-master.withdraws.update');

			// Organizations
			Route::get('/organization-menu', OrganizationMenuController::class)->name('admin.organization.menu');
			Route::get('/organizations', [AdminOrganizationController::class, 'index'])->name('admin.organization.index');
			Route::patch('/organizations/update-status/{organization}', [AdminOrganizationController::class, 'updateStatus'])->name('admin.organization.update.status');

			Route::get('/organization-invoice', [AdminOrganizationInvoiceController::class, 'index'])->name('admin.organization.invoice.index');
			Route::patch('/organization-invoice/{organizationInvoice}/payment-confirmation', [AdminOrganizationInvoiceController::class, 'paymentConfirmation'])->name('admin.organization.invoice.payment.confirmation');

			// Add-ons
			Route::prefix('add-ons')->group(function () {
				Route::get('/', AdminAddonsController::class)->name('admin.add-ons');

				// whatsapp
				Route::prefix('whatsapp')->group(function () {
					Route::get('/', AdminWhatsappBroadcastingController::class)->name('admin.add-ons.whatsapp');

					// Data
					Route::get('/data', [AdminWhatsappBroadcastingDataController::class, 'index'])->name('admin.add-ons.whatsapp.data');
					Route::patch('/data/{plugin}', [AdminWhatsappBroadcastingDataController::class, 'update'])->name('admin.add-ons.whatsapp.data.update');
					Route::patch('/data/{plugin}/connection', [AdminWhatsappBroadcastingDataController::class, 'connection'])->name('admin.add-ons.whatsapp.data.connection');
					
					// Invoice
					Route::get('/invoice', [AdminWhatsappBroadcastingInvoiceController::class, 'index'])->name('admin.add-ons.whatsapp.invoice');
					Route::patch('/invoice/{invoice}', [AdminWhatsappBroadcastingInvoiceController::class, 'confirmation'])->name('admin.add-ons.whatsapp.invoice.confirmation');
					
				});
			});

		});
	});

	//Organization's list
	Route::get('/organizations', [OrganizationController::class, 'index'])->name('organization');
	Route::get('/organizations/create', [OrganizationController::class, 'create'])->name('organization.create');
	Route::get('/organizations/{organization}', [OrganizationController::class, 'show'])->name('organization.show');
	Route::post('/organizations', [OrganizationController::class, 'store'])->name('organization.store');
	Route::get('/organizations/{organization}/edit', [OrganizationController::class, 'edit'])->name('organization.edit');
	Route::patch('/organizations/{organization}', [OrganizationController::class, 'update'])->name('organization.update');
	Route::get('/organizations/{organization}/share-to-other', [OrganizationController::class, 'shareToOther'])->name('organization.share-to-other');
	Route::post('/organizations/{organization}/share-to-other', [OrganizationController::class, 'shareToOtherStore'])->name('organization.share-to-other.post');
	Route::patch('/organizations/{organization}/share-to-other', [OrganizationController::class, 'shareToOtherUpdate'])->name('organization.share-to-other.patch');
	Route::delete('/organizations/{organization}/share-to-other', [OrganizationController::class, 'shareToOtherDestroy'])->name('organization.share-to-other.delete');
	Route::patch('/organizations/{organization}/share-to-other/confirmation', [OrganizationController::class, 'shareToOtherPatchConfirmation'])->name('organization.share-to-other.patch.confirmation');

	// Invoice
	Route::get('/organizations/{organization}/invoices', [OrganizationInvoiceController::class, 'index'])->name('organization.invoice');
	Route::get('/organizations/{organization}/invoices/create', [OrganizationInvoiceController::class, 'create'])->name('organization.invoice.create');
	Route::post('/organizations/{organization}/invoices/', [OrganizationInvoiceController::class, 'store'])->name('organization.invoice.post');
	Route::get('/organizations/{organization}/invoices/{organizationInvoice}', [OrganizationInvoiceController::class, 'show'])->name('organization.invoice.show')->middleware('user.has.organization:{parameter}');

	//Affiliation
	Route::get('/affiliation/{affiliation}', [AffiliationController::class, 'index'])->name('affiliation.index');
	Route::get('/affiliation-withdraw/{affiliationWithdraw}/detail', [AffiliationController::class, 'detail'])->name('affiliationWithdraw.detail');
	Route::patch('/affiliation/{affiliation}', [AffiliationController::class, 'withdraw'])->name('affiliation.patch');

	Route::middleware([
		'user.has.organization:{parameter}',
		'is.not.expired:{parameter}',
	])->group(function () {
		//Dashboard
		Route::get('/dashboard/{organization}', [DashboardController::class, 'index'])->name('dashboard');
		//

		// Log
		Route::get('/logs/{organization}', LogController::class)->name('logs');

		Route::prefix('add-ons/{organization}')->group(function () {
			Route::get('/', AddonsController::class)->name('add-ons');
			Route::get('/whatsapp-log', WhatsappLogActivityController::class)->name('add-ons.whatsapp-log');

			// whatsapp
			Route::get('/whatsapp', [WhatsappBroadcastingController::class, 'index'])->name('add-ons.whatsapp');
			Route::get('/whatsapp/status', [WhatsappBroadcastingController::class, 'status'])->name('add-ons.whatsapp.status');
			Route::patch('/whatsapp/status', [WhatsappBroadcastingController::class, 'update'])->name('add-ons.whatsapp.status.update');
			Route::patch('/whatsapp/check-connection', [WhatsappBroadcastingController::class, 'checkConnection'])->name('add-ons.whatsapp.status.check-connection');

			// whatsapp invoice
			Route::get('/whatsapp-invoice', [WhatsappBroadcastingInvoiceController::class, 'index'])->name('add-ons.whatsapp-invoice');
			Route::post('/whatsapp-invoice', [WhatsappBroadcastingInvoiceController::class, 'store'])->name('add-ons.whatsapp-invoice.store');
			Route::get('/whatsapp-invoice/create', [WhatsappBroadcastingInvoiceController::class, 'create'])->name('add-ons.whatsapp-invoice.create');
			Route::get('/whatsapp-invoice/{invoice}', [WhatsappBroadcastingInvoiceController::class, 'show'])->name('add-ons.whatsapp-invoice.show');
		});

		// Menu Setting
		Route::get('/menu-setting/{organization}', [MenuSettingController::class, 'index'])->name('menu-setting');
		Route::patch('/menu-setting/{organization}', [MenuSettingController::class, 'update'])->name('menu-setting.update');

		// Data Master
		Route::prefix('data-master/{organization}')->group(function () {
			Route::get('/', DataMasterController::class)->name('data-master');

			// Contact
			Route::get('/contacts', [ContactController::class, 'index'])->name('data-master.contact');
			Route::get('/contacts/create', [ContactController::class, 'create'])->name('data-master.contact.create')->middleware('is.not.viewer');
			Route::post('/contacts', [ContactController::class, 'store'])->name('data-master.contact.store')->middleware('is.not.viewer');
			Route::get('/contacts/{contact}/edit', [ContactController::class, 'edit'])->name('data-master.contact.edit')->middleware('is.not.viewer');
			Route::patch('/contacts/{contact}', [ContactController::class, 'update'])->name('data-master.contact.update')->middleware('is.not.viewer');
			Route::delete('/contacts/{contact}', [ContactController::class, 'destroy'])->name('data-master.contact.destroy')->middleware('is.not.viewer');

			// Contact Category
			Route::get('/contact-categories', [ContactCategoryController::class, 'index'])->name('data-master.contact-category');
			Route::post('/contact-categories', [ContactCategoryController::class, 'store'])->name('data-master.contact-category.post')->middleware('is.not.viewer');
			Route::patch('/contact-categories/{contactCategory}', [ContactCategoryController::class, 'update'])->name('data-master.contact-category.update')->middleware('is.not.viewer');
			Route::delete('/contact-categories/{contactCategory}', [ContactCategoryController::class, 'destroy'])->name('data-master.contact-category.destroy')->middleware('is.not.viewer');

			// Projects
			Route::get('/projects', [ProjectController::class, 'index'])->name('data-master.project');
			Route::get('/projects/create', [ProjectController::class, 'create'])->name('data-master.project.create')->middleware('is.not.viewer');
			Route::post('/projects', [ProjectController::class, 'store'])->name('data-master.project.post')->middleware('is.not.viewer');
			Route::get('/projects/{project}/edit', [ProjectController::class, 'edit'])->name('data-master.project.edit')->middleware('is.not.viewer');
			Route::get('/projects/{project}', [ProjectController::class, 'show'])->name('data-master.project.show');
			Route::patch('/projects/{project}', [ProjectController::class, 'update'])->name('data-master.project.update')->middleware('is.not.viewer');
			Route::delete('/projects/{project}', [ProjectController::class, 'destroy'])->name('data-master.project.destroy')->middleware('is.not.viewer');

			// Programs
			Route::get('/programs', [ProgramController::class, 'index'])->name('data-master.program');
			Route::post('/programs', [ProgramController::class, 'store'])->name('data-master.program.post')->middleware('is.not.viewer');
			Route::patch('/programs/{program}', [ProgramController::class, 'update'])->name('data-master.program.update')->middleware('is.not.viewer');
			Route::delete('/programs/{program}', [ProgramController::class, 'destroy'])->name('data-master.program.destroy')->middleware('is.not.viewer');

			// Departments
			Route::get('/departments', [DepartmentController::class, 'index'])->name('data-master.department');
			Route::post('/departments', [DepartmentController::class, 'store'])->name('data-master.department.post')->middleware('is.not.viewer');
			Route::patch('/departments/{department}', [DepartmentController::class, 'update'])->name('data-master.department.update')->middleware('is.not.viewer');
			Route::delete('/departments/{department}', [DepartmentController::class, 'destroy'])->name('data-master.department.destroy')->middleware('is.not.viewer');

			// Fixed Asset Category
			Route::get('/fixed-asset-categories', [FixedAssetCategoryController::class, 'index'])->name('data-master.fixed-asset-category');
			Route::post('/fixed-asset-categories', [FixedAssetCategoryController::class, 'store'])->name('data-master.fixed-asset-category.post')->middleware('is.not.viewer');
			Route::patch('/fixed-asset-categories/{fixedAssetCategory}', [FixedAssetCategoryController::class, 'update'])->name('data-master.fixed-asset-category.update')->middleware('is.not.viewer');
			Route::delete('/fixed-asset-categories/{fixedAssetCategory}', [FixedAssetCategoryController::class, 'destroy'])->name('data-master.fixed-asset-category.destroy')->middleware('is.not.viewer');

			// Fixed Asset
			Route::get('fixed-assets', [FixedAssetController::class, 'index'])->name('data-master.fixed-asset');
			Route::post('fixed-assets', [FixedAssetController::class, 'store'])->name('data-master.fixed-asset.post');
			Route::get('fixed-assets/create', [FixedAssetController::class, 'create'])->name('data-master.fixed-asset.create');
			Route::get('fixed-assets/{fixedAsset}/edit', [FixedAssetController::class, 'edit'])->name('data-master.fixed-asset.edit')->middleware('is.not.viewer');
			Route::get('fixed-assets/{fixedAsset}', [FixedAssetController::class, 'show'])->name('data-master.fixed-asset.show');
			Route::patch('fixed-assets/{fixedAsset}', [FixedAssetController::class, 'update'])->name('data-master.fixed-asset.update')->middleware('is.not.viewer');
			Route::delete('fixed-assets/{fixedAsset}', [FixedAssetController::class, 'destroy'])->name('data-master.fixed-asset.destroy')->middleware('is.not.viewer');
			Route::patch('fixed-assets/{fixedAsset}/disposal', [FixedAssetController::class, 'disposal'])->name('data-master.fixed-asset.disposal')->middleware('is.not.viewer');

			// Student
			Route::get('/students', [StudentContactController::class, 'index'])->name('data-master.students');
			Route::get('/students/create', [StudentContactController::class, 'create'])->name('data-master.students.create');
			Route::get('/students/import', [StudentContactController::class, 'importStudent'])->name('data-master.students.import')->middleware('is.not.viewer');
			Route::post('/students/import', [StudentContactController::class, 'storeImportStudent'])->name('data-master.students.import.post')->middleware('is.not.viewer');
			Route::get('/students/download-template', [StudentContactController::class, 'downloadTemplate'])->name('data-master.students.download-template')->middleware('is.not.viewer');
			Route::get('/students/{contact}', [StudentContactController::class, 'show'])->name('data-master.students.show')->middleware('is.not.viewer');
			Route::get('/students/{contact}/edit', [StudentContactController::class, 'edit'])->name('data-master.students.edit')->middleware('is.not.viewer');
			Route::post('/students', [StudentContactController::class, 'store'])->name('data-master.students.post')->middleware('is.not.viewer');
			Route::patch('/students/{contact}', [StudentContactController::class, 'update'])->name('data-master.students.update')->middleware('is.not.viewer');
			Route::delete('/students/{contact}', [StudentContactController::class, 'destroy'])->name('data-master.students.destroy')->middleware('is.not.viewer');

			Route::patch('/student-level/{level}', [StudentLevelController::class, 'update'])->name('data-master.student-level.update');

			// Student Payment Category
			Route::get('/student-payment-category', [StudentPaymentCategoryController::class, 'index'])->name('data-master.student-payment-category');
			Route::post('/student-payment-category', [StudentPaymentCategoryController::class, 'store'])->name('data-master.student-payment-category.store')->middleware('is.not.viewer');
			Route::patch('/student-payment-category/{studentPaymentCategory}', [StudentPaymentCategoryController::class, 'update'])->name('data-master.student-payment-category.update')->middleware('is.not.viewer');
			Route::delete('/student-payment-category/{studentPaymentCategory}', [StudentPaymentCategoryController::class, 'destroy'])->name('data-master.student-payment-category.destroy')->middleware('is.not.viewer');

			// Student Entry Payment Category
			Route::get('/student-entry-payment-category', [StudentEntryPaymentCategoryController::class, 'index'])->name('data-master.student-entry-payment-category');
			Route::post('/student-entry-payment-category', [StudentEntryPaymentCategoryController::class, 'store'])->name('data-master.student-entry-payment-category.store')->middleware('is.not.viewer');
			Route::patch('/student-entry-payment-category/{studentEntryPaymentCategory}', [StudentEntryPaymentCategoryController::class, 'update'])->name('data-master.student-entry-payment-category.update')->middleware('is.not.viewer');
			Route::delete('/student-entry-payment-category/{studentEntryPaymentCategory}', [StudentEntryPaymentCategoryController::class, 'destroy'])->name('data-master.student-entry-payment-category.destroy')->middleware('is.not.viewer');

			// Staff Contact
			Route::get('/staff', [StaffContactController::class, 'index'])->name('data-master.staff');
			Route::get('/staff/import', [StaffContactController::class, 'importStaff'])->name('data-master.staff.import');
			Route::post('/staff/import', [StaffContactController::class, 'storeImportStaff'])->name('data-master.staff.import.post')->middleware('is.not.viewer');
			Route::post('/staff', [StaffContactController::class, 'store'])->name('data-master.staff.store')->middleware('is.not.viewer');
			Route::patch('/staff/{contact}', [StaffContactController::class, 'update'])->name('data-master.staff.update')->middleware('is.not.viewer');
			Route::delete('/staff/{contact}', [StaffContactController::class, 'destroy'])->name('data-master.staff.destroy')->middleware('is.not.viewer');

			// Salary Category
			Route::get('/salary-category', [SalaryCategoryController::class, 'index'])->name('data-master.salary-category');
			Route::post('/salary-category', [SalaryCategoryController::class, 'store'])->name('data-master.salary-category.store')->middleware('is.not.viewer');
			Route::patch('/salary-category/{salaryCategory}', [SalaryCategoryController::class, 'update'])->name('data-master.salary-category.update')->middleware('is.not.viewer');
			Route::delete('/salary-category/{salaryCategory}', [SalaryCategoryController::class, 'destroy'])->name('data-master.salary-category.destroy')->middleware('is.not.viewer');

		});

		// Accountancy
		Route::prefix('data-ledger/{organization}')->group(function () {
			Route::get('/', DataLedgerController::class)->name('data-ledger');

			// Account Category
			Route::get('/account-categories', [AccountCategoryController::class, 'index'])->name('data-ledger.account-category');
			Route::post('/account-categories', [AccountCategoryController::class, 'store'])->name('data-ledger.account-category.post')->middleware('is.not.viewer');
			Route::patch('/account-categories/{accountCategory}', [AccountCategoryController::class, 'update'])->name('data-ledger.account-category.patch')->middleware('is.not.viewer');
			Route::delete('/account-categories/{accountCategory}', [AccountCategoryController::class, 'destroy'])->name('data-ledger.account-category.delete')->middleware('is.not.viewer');

			// Account
			Route::get('/accounts', [AccountController::class, 'index'])->name('data-ledger.account');
			Route::post('/accounts', [AccountController::class, 'store'])->name('data-ledger.account.post')->middleware('is.not.viewer');
			Route::patch('/accounts/{account}', [AccountController::class, 'update'])->name('data-ledger.account.update')->middleware('is.not.viewer');
			Route::delete('/accounts/{account}', [AccountController::class, 'destroy'])->name('data-ledger.account.delete')->middleware('is.not.viewer');

			// Account School
			Route::get('/account-school', [AccountSchoolController::class, 'index'])->name('data-ledger.account-school');
			Route::patch('/account-school', [AccountSchoolController::class, 'update'])->name('data-ledger.account-school.update');

			// Account Staff
			Route::get('/account-staff', [AccountStaffController::class, 'index'])->name('data-ledger.account-staff');
			Route::patch('/account-staff', [AccountStaffController::class, 'update'])->name('data-ledger.account-staff.update');

			// Journal
			Route::get('/journals', [JournalController::class, 'index'])->name('data-ledger.journal');
			Route::post('/journals', [JournalController::class, 'store'])->name('data-ledger.journal.store')->middleware('is.not.viewer');
			Route::get('/journals/create', [JournalController::class, 'create'])->name('data-ledger.journal.create')->middleware('is.not.viewer');
			Route::get('/journals/{journal}', [JournalController::class, 'show'])->name('data-ledger.journal.show');
			Route::get('/journals/{journal}/edit', [JournalController::class, 'edit'])->name('data-ledger.journal.edit')->middleware('is.not.viewer');
			Route::patch('/journals/{journal}', [JournalController::class, 'update'])->name('data-ledger.journal.update')->middleware('is.not.viewer');
			Route::delete('/journals/{journal}', [JournalController::class, 'destroy'])->name('data-ledger.journal.delete')->middleware('is.not.viewer');
		});

		// Reports
		Route::prefix('reports/{organization}')->group(function () {
			Route::get('/', [ReportController::class, 'index'])->name('report');
			Route::get('/cashflow', [ReportController::class, 'cashflow'])->name('report.cashflow');
			Route::get('/balance', [ReportController::class, 'balance'])->name('report.balance');
			Route::get('/lost-profit', [ReportController::class, 'lostProfit'])->name('report.lost-profit');
			Route::get('/journal', [ReportController::class, 'journal'])->name('report.journal');
			Route::get('/ledger', [ReportController::class, 'ledger'])->name('report.ledger');
			Route::get('/ledgers', [ReportController::class, 'ledgers'])->name('report.ledgers');
			Route::get('/trial-balance', [ReportController::class, 'trialBalance'])->name('report.trial-balance');
		});

		// Cashflow
		Route::prefix('cashflows/{organization}')->group(function () {
			Route::get('/', CashflowController::class)->name('cashflow');

			// cash in
			Route::get('/cash-in', [CashinController::class, 'index'])->name('cashflow.cash-in');
			Route::get('/cash-in/create', [CashinController::class, 'create'])->name('cashflow.cash-in.create');
			Route::post('/cash-in', [CashinController::class, 'store'])->name('cashflow.cash-in.post');
			Route::get('/cash-in/{cashIn}/edit', [CashinController::class, 'edit'])->name('cashflow.cash-in.edit');
			Route::get('/cash-in/{cashIn}', [CashinController::class, 'show'])->name('cashflow.cash-in.show');
			Route::patch('/cash-in/{cashIn}', [CashinController::class, 'update'])->name('cashflow.cash-in.update');
			Route::delete('/cash-in/{cashIn}', [CashinController::class, 'destroy'])->name('cashflow.cash-in.delete');

			//cash out
			Route::get('/cash-out', [CashoutController::class, 'index'])->name('cashflow.cash-out');
			Route::get('/cash-out/create', [CashoutController::class, 'create'])->name('cashflow.cash-out.create');
			Route::post('/cash-out', [CashoutController::class, 'store'])->name('cashflow.cash-out.post');
			Route::get('/cash-out/{cashOut}/edit', [CashoutController::class, 'edit'])->name('cashflow.cash-out.edit');
			Route::get('/cash-out/{cashOut}', [CashoutController::class, 'show'])->name('cashflow.cash-out.show');
			Route::patch('/cash-out/{cashOut}', [CashoutController::class, 'update'])->name('cashflow.cash-out.update');
			Route::delete('/cash-out/{cashOut}', [CashoutController::class, 'destroy'])->name('cashflow.cash-out.delete');

			//cash out
			Route::get('/cash-mutation', [CashMutationController::class, 'index'])->name('cashflow.cash-mutation');
			Route::get('/cash-mutation/create', [CashMutationController::class, 'create'])->name('cashflow.cash-mutation.create');
			Route::get('/cash-mutation/{cashMutation}/edit', [CashMutationController::class, 'edit'])->name('cashflow.cash-mutation.edit');
			Route::get('/cash-mutation/{cashMutation}', [CashMutationController::class, 'show'])->name('cashflow.cash-mutation.show');
			Route::patch('/cash-mutation/{cashMutation}', [CashMutationController::class, 'update'])->name('cashflow.cash-mutation.update');
			Route::delete('/cash-mutation/{cashMutation}', [CashMutationController::class, 'destroy'])->name('cashflow.cash-mutation.delete');
			Route::post('/cash-mutation/create', [CashMutationController::class, 'store'])->name('cashflow.cash-mutation.post');

			// student monthly payment
			Route::get('/student-monthly-payment', [StudentMonthlyPaymentController::class, 'index'])->name('cashflow.student-monthly-payment');
			Route::get('/student-monthly-payment/create', [StudentMonthlyPaymentController::class, 'create'])->name('cashflow.student-monthly-payment.create');
			Route::get('/student-monthly-payment/{payment}/edit', [StudentMonthlyPaymentController::class, 'edit'])->name('cashflow.student-monthly-payment.edit');
			Route::get('/student-monthly-payment/{payment}/show', [StudentMonthlyPaymentController::class, 'show'])->name('cashflow.student-monthly-payment.show');
			Route::post('/student-monthly-payment', [StudentMonthlyPaymentController::class, 'store'])->name('cashflow.student-monthly-payment.post');
			Route::post('/student-monthly-payment/{payment}/send-whatsapp', [StudentMonthlyPaymentController::class, 'sendWhatsApp'])->name('cashflow.student-monthly-payment.send-whatsapp');
			Route::patch('/student-monthly-payment/{payment}', [StudentMonthlyPaymentController::class, 'update'])->name('cashflow.student-monthly-payment.update');
			Route::delete('/student-monthly-payment/{payment}', [StudentMonthlyPaymentController::class, 'destroy'])->name('cashflow.student-monthly-payment.delete');

			// student receivable
			Route::get('/student-monthly-receivable', [StudentMonthlyReceivableController::class, 'index'])->name('cashflow.student-monthly-receivable');
			Route::get('/student-monthly-receivable/create', [StudentMonthlyReceivableController::class, 'create'])->name('cashflow.student-monthly-receivable.create');
			Route::post('/student-monthly-receivable', [StudentMonthlyReceivableController::class, 'store'])->name('cashflow.student-monthly-receivable.store');
			Route::post('/student-monthly-receivable/{receivable}/send-whatsapp', [StudentMonthlyReceivableController::class, 'sendWhatsApp'])->name('cashflow.student-monthly-receivable.send-whatsapp');
			Route::post('/student-monthly-receivable/send-whatsapp-multi', [StudentMonthlyReceivableController::class, 'sendWhatsAppMulti'])->name('cashflow.student-monthly-receivable.send-whatsapp-multi');
			Route::get('/student-monthly-receivable/{receivable}', [StudentMonthlyReceivableController::class, 'show'])->name('cashflow.student-monthly-receivable.show');
			Route::get('/student-monthly-receivable/{receivable}/edit/{ledger}', [StudentMonthlyReceivableController::class, 'edit'])->name('cashflow.student-monthly-receivable.edit');
			Route::get('/student-monthly-receivable/{receivable}/print', [StudentMonthlyReceivableController::class, 'print'])->name('cashflow.student-monthly-receivable.print');
			Route::patch('/student-monthly-receivable/{receivable}/edit/{ledger}', [StudentMonthlyReceivableController::class, 'update'])->name('cashflow.student-monthly-receivable.update');
			Route::delete('/student-monthly-receivable/{receivable}/edit/{ledger}', [StudentMonthlyReceivableController::class, 'destroy'])->name('cashflow.student-monthly-receivable.delete');
			
			// student entry payment
			Route::get('/student-entry-payment', [StudentEntryPaymentController::class, 'index'])->name('cashflow.student-entry-payment');
			Route::get('/student-entry-payment/create', [StudentEntryPaymentController::class, 'create'])->name('cashflow.student-entry-payment.create');
			Route::post('/student-entry-payment', [StudentEntryPaymentController::class, 'store'])->name('cashflow.student-entry-payment.store');
			Route::post('/student-entry-payment/{payment}/send-whatsapp', [StudentEntryPaymentController::class, 'sendWhatsapp'])->name('cashflow.student-entry-payment.send-whatsapp');
			Route::get('/student-entry-payment/{payment}', [StudentEntryPaymentController::class, 'show'])->name('cashflow.student-entry-payment.show');
			Route::get('/student-entry-payment/{payment}/edit', [StudentEntryPaymentController::class, 'edit'])->name('cashflow.student-entry-payment.edit');
			Route::patch('/student-entry-payment/{payment}', [StudentEntryPaymentController::class, 'update'])->name('cashflow.student-entry-payment.update');
			Route::delete('/student-entry-payment/{payment}', [StudentEntryPaymentController::class, 'destroy'])->name('cashflow.student-entry-payment.delete');

			// student entry receivable
			Route::get('/student-entry-receivable', [StudentEntryReceivableController::class, 'index'])->name('cashflow.student-entry-receivable');
			Route::get('/student-entry-receivable/{studentEntryReceivable}', [StudentEntryReceivableController::class, 'show'])->name('cashflow.student-entry-receivable.show');
			Route::get('/student-entry-receivable/{studentEntryReceivable}/print', [StudentEntryReceivableController::class, 'print'])->name('cashflow.student-entry-receivable.print');
			Route::get('/student-entry-receivable/{payment}/print-per-paymant', [StudentEntryReceivableController::class, 'printPerPayment'])->name('cashflow.student-entry-receivable.print-per-payment');
			Route::post('/student-entry-receivable/{studentEntryReceivable}/send-whatsapp', [StudentEntryReceivableController::class, 'sendWhatsapp'])->name('cashflow.student-entry-receivable.send-whatsapp');
			Route::post('/student-entry-receivable/send-whatsapp-multi', [StudentEntryReceivableController::class, 'sendWhatsappMulti'])->name('cashflow.student-entry-receivable.send-whatsapp-multi');

			// student entry receivable payment
			Route::get('/student-entry-receivable-payment', [StudentEntryReceivablePaymentController::class, 'index'])->name('cashflow.student-entry-receivable-payment');
			Route::get('/student-entry-receivable-payment/create', [StudentEntryReceivablePaymentController::class, 'create'])->name('cashflow.student-entry-receivable-payment.create');
			Route::get('/student-entry-receivable-payment/{receivablePayment}', [StudentEntryReceivablePaymentController::class, 'show'])->name('cashflow.student-entry-receivable-payment.show');
			Route::post('/student-entry-receivable-payment/{receivablePayment}/send-whatsapp', [StudentEntryReceivablePaymentController::class, 'sendWhatsapp'])->name('cashflow.student-entry-receivable-payment.send-whatsapp');
			Route::get('/student-entry-receivable-payment/{receivablePayment}/edit', [StudentEntryReceivablePaymentController::class, 'edit'])->name('cashflow.student-entry-receivable-payment.edit');
			Route::post('/student-entry-receivable-payment', [StudentEntryReceivablePaymentController::class, 'store'])->name('cashflow.student-entry-receivable-payment.store');
			Route::patch('/student-entry-receivable-payment/{receivablePayment}', [StudentEntryReceivablePaymentController::class, 'update'])->name('cashflow.student-entry-receivable-payment.update');
			Route::delete('/student-entry-receivable-payment/{receivablePayment}', [StudentEntryReceivablePaymentController::class, 'destroy'])->name('cashflow.student-entry-receivable-payment.delete');
								
			// staff salary
			Route::get('/staff-salary-payment', [StaffSalaryPaymentController::class, 'index'])->name('cashflow.staff-salary-payment');
			Route::get('/staff-salary-payment/create', [StaffSalaryPaymentController::class, 'create'])->name('cashflow.staff-salary-payment.create');
			Route::post('/staff-salary-payment', [StaffSalaryPaymentController::class, 'store'])->name('cashflow.staff-salary-payment.store');
			Route::get('/staff-salary-payment/{id}', [StaffSalaryPaymentController::class, 'show'])->name('cashflow.staff-salary-payment.show');
			Route::patch('/staff-salary-payment/{payment}', [StaffSalaryPaymentController::class, 'update'])->name('cashflow.staff-salary-payment.update');
			Route::get('/staff-salary-payment/{payment}/print', [StaffSalaryPaymentController::class, 'print'])->name('cashflow.staff-salary-payment.staff.print');
			Route::get('/staff-salary-payment/{id}/{staff}', [StaffSalaryPaymentController::class, 'showStaff'])->name('cashflow.staff-salary-payment.staff');
			Route::post('/staff-salary-payment/{id}/{staff}/send-whatsapp', [StaffSalaryPaymentController::class, 'sendWhatsapp'])->name('cashflow.staff-salary-payment.send-whatsapp');
			Route::post('/staff-salary-payment/{payment}/send-whatsapp-multi', [StaffSalaryPaymentController::class, 'sendWhatsappMulti'])->name('cashflow.staff-salary-payment.send-whatsapp-multi');
			Route::get('/staff-salary-payment/{id}/{staff}/edit', [StaffSalaryPaymentController::class, 'editStaff'])->name('cashflow.staff-salary-payment.staff.edit');
			Route::patch('/staff-salary-payment/{payment}/{staff}', [StaffSalaryPaymentController::class, 'updateStaff'])->name('cashflow.staff-salary-payment.staff.update');

			// debt
			Route::get('/debt', DebtController::class)->name('cashflow.debt');
			
			// saving
			Route::get('/saving', SavingController::class)->name('cashflow.saving');

			// saving category
			Route::get('/saving/category', [SavingCategoryController::class, 'index'])->name('cashflow.saving-category');
			Route::post('/saving/category', [SavingCategoryController::class, 'store'])->name('cashflow.saving-category.store');
			Route::patch('/saving/category/{category}', [SavingCategoryController::class, 'update'])->name('cashflow.saving-category.update');
			Route::delete('/saving/category/{category}', [SavingCategoryController::class, 'destroy'])->name('cashflow.saving-category.delete');

			// saving ledger
			Route::get('/saving/ledger', [SavingLedgerController::class, 'index'])->name('cashflow.saving.ledger');
			Route::get('/saving/ledger/{ledger}', [SavingLedgerController::class, 'show'])->name('cashflow.saving.ledger.show');
			Route::post('/saving/ledger', [SavingLedgerController::class, 'store'])->name('cashflow.saving.ledger.store');
			Route::patch('/saving/ledger/{ledger}', [SavingLedgerController::class, 'update'])->name('cashflow.saving.ledger.update');
			Route::delete('/saving/ledger/{ledger}', [SavingLedgerController::class, 'destroy'])->name('cashflow.saving.ledger.delete');

			// savings
			Route::get('/saving/balance', [SavingBalanceController::class, 'index'])->name('cashflow.saving.balance');
			Route::get('/saving/balance/{balance}', [SavingBalanceController::class, 'show'])->name('cashflow.saving.balance.show');
			Route::post('/saving/balance', [SavingBalanceController::class, 'store'])->name('cashflow.saving.balance.store');
			Route::patch('/saving/balance/{balance}', [SavingBalanceController::class, 'update'])->name('cashflow.saving.balance.update');
			Route::delete('/saving/balance/{balance}', [SavingBalanceController::class, 'destroy'])->name('cashflow.saving.balance.delete');

		});

	});
});

Route::middleware('auth')->group(function () {
	Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
	Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
	Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});

require __DIR__.'/auth.php';
