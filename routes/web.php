
<?php

use Inertia\Inertia;
use Illuminate\Support\Facades\Route;
use Illuminate\Foundation\Application;
use App\Http\Controllers\LogController;
use App\Http\Controllers\CashinController;
use App\Http\Controllers\ReportController;
use App\Http\Controllers\AccountController;
use App\Http\Controllers\CashoutController;
use App\Http\Controllers\ContactController;
use App\Http\Controllers\JournalController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\ProgramController;
use App\Http\Controllers\ProjectController;
use App\Http\Controllers\CashflowController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\DataLedgerController;
use App\Http\Controllers\DataMasterController;
use App\Http\Controllers\DepartmentController;
use App\Http\Controllers\FixedAssetController;
use App\Http\Controllers\AffiliationController;
use App\Http\Controllers\CashMutationController;
use App\Http\Controllers\OrganizationController;
use App\Http\Controllers\Admin\RegencyController;
use App\Http\Controllers\Admin\VillageController;
use App\Http\Controllers\Admin\DistrictController;
use App\Http\Controllers\Admin\ProvinceController;
use App\Http\Controllers\AccountCategoryController;
use App\Http\Controllers\Admin\AdminUserController;
use App\Http\Controllers\ContactCategoryController;
use App\Http\Controllers\Admin\AdminMasterController;
use App\Http\Controllers\FixedAssetCategoryController;
use App\Http\Controllers\OrganizationInvoiceController;
use App\Http\Controllers\Admin\AdminDashboardController;
use App\Http\Controllers\Admin\OrganizationMenuController;
use App\Http\Controllers\Admin\AdminOrganizationController;
use App\Http\Controllers\Admin\AdminOrganizationInvoiceController;

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

            // Users
            Route::get('/users', [AdminUserController::class, 'index'])->name('admin.users');
            Route::patch('/users/{user}/affiliation', [AdminUserController::class, 'storeAffiliation'])->name('admin.user.store.affiliation');

            // Organizations
            Route::get('/organization-menu', OrganizationMenuController::class)->name('admin.organization.menu');
            Route::get('/organizations', [AdminOrganizationController::class, 'index'])->name('admin.organization.index');
            Route::patch('/organizations/update-status/{organization}', [AdminOrganizationController::class, 'updateStatus'])->name('admin.organization.update.status');

            Route::get('/organization-invoice', [AdminOrganizationInvoiceController::class, 'index'])->name('admin.organization.invoice.index');
            Route::patch('/organization-invoice/{organizationInvoice}/payment-confirmation', [AdminOrganizationInvoiceController::class, 'paymentConfirmation'])->name('admin.organization.invoice.payment.confirmation');
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
            Route::post('/fixed-asset-categories', [FixedAssetCategoryController::class, 'store'])->name('data-master.fixed-asset-category.post');
            Route::patch('/fixed-asset-categories/{fixedAssetCategory}', [FixedAssetCategoryController::class, 'update'])->name('data-master.fixed-asset-category.update');
            Route::delete('/fixed-asset-categories/{fixedAssetCategory}', [FixedAssetCategoryController::class, 'destroy'])->name('data-master.fixed-asset-category.destroy');

            // Fixed Asset
            Route::get('fixed-assets', [FixedAssetController::class, 'index'])->name('data-master.fixed-asset');
            Route::post('fixed-assets', [FixedAssetController::class, 'store'])->name('data-master.fixed-asset.post');
            Route::get('fixed-assets/create', [FixedAssetController::class, 'create'])->name('data-master.fixed-asset.create');
            Route::get('fixed-assets/{fixedAsset}/edit', [FixedAssetController::class, 'edit'])->name('data-master.fixed-asset.edit');
            Route::get('fixed-assets/{fixedAsset}', [FixedAssetController::class, 'show'])->name('data-master.fixed-asset.show');
            Route::patch('fixed-assets/{fixedAsset}', [FixedAssetController::class, 'update'])->name('data-master.fixed-asset.update');
            Route::delete('fixed-assets/{fixedAsset}', [FixedAssetController::class, 'destroy'])->name('data-master.fixed-asset.destroy');
            Route::patch('fixed-assets/{fixedAsset}/disposal', [FixedAssetController::class, 'disposal'])->name('data-master.fixed-asset.disposal');

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
            Route::get('/cash-in/{cashIn}/edit', [CashinController::class, 'edit'])->name('cashflow.cash-in.edit');
            Route::get('/cash-in/{cashIn}', [CashinController::class, 'show'])->name('cashflow.cash-in.show');
            Route::patch('/cash-in/{cashIn}', [CashinController::class, 'update'])->name('cashflow.cash-in.update');
            Route::delete('/cash-in/{cashIn}', [CashinController::class, 'destroy'])->name('cashflow.cash-in.delete');
            Route::post('/cash-in/create', [CashinController::class, 'store'])->name('cashflow.cash-in.post');

            //cash out
            Route::get('/cash-out', [CashoutController::class, 'index'])->name('cashflow.cash-out');
            Route::get('/cash-out/create', [CashoutController::class, 'create'])->name('cashflow.cash-out.create');
            Route::get('/cash-out/{cashOut}/edit', [CashoutController::class, 'edit'])->name('cashflow.cash-out.edit');
            Route::get('/cash-out/{cashOut}', [CashoutController::class, 'show'])->name('cashflow.cash-out.show');
            Route::patch('/cash-out/{cashOut}', [CashoutController::class, 'update'])->name('cashflow.cash-out.update');
            Route::delete('/cash-out/{cashOut}', [CashoutController::class, 'destroy'])->name('cashflow.cash-out.delete');
            Route::post('/cash-out/create', [CashoutController::class, 'store'])->name('cashflow.cash-out.post');

            //cash out
            Route::get('/cash-mutation', [CashMutationController::class, 'index'])->name('cashflow.cash-mutation');
            Route::get('/cash-mutation/create', [CashMutationController::class, 'create'])->name('cashflow.cash-mutation.create');
            Route::get('/cash-mutation/{cashMutation}/edit', [CashMutationController::class, 'edit'])->name('cashflow.cash-mutation.edit');
            Route::get('/cash-mutation/{cashMutation}', [CashMutationController::class, 'show'])->name('cashflow.cash-mutation.show');
            Route::patch('/cash-mutation/{cashMutation}', [CashMutationController::class, 'update'])->name('cashflow.cash-mutation.update');
            Route::delete('/cash-mutation/{cashMutation}', [CashMutationController::class, 'destroy'])->name('cashflow.cash-mutation.delete');
            Route::post('/cash-mutation/create', [CashMutationController::class, 'store'])->name('cashflow.cash-mutation.post');

        });

    });
});

Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});

require __DIR__.'/auth.php';
