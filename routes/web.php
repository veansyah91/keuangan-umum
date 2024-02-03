<?php

use Inertia\Inertia;
use Illuminate\Support\Facades\Route;
use Illuminate\Foundation\Application;
use App\Http\Controllers\LogController;
use App\Http\Controllers\ContactController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\DataMasterController;
use App\Http\Controllers\OrganizationController;
use App\Http\Controllers\Admin\RegencyController;
use App\Http\Controllers\Admin\VillageController;
use App\Http\Controllers\Admin\DistrictController;
use App\Http\Controllers\Admin\ProvinceController;
use App\Http\Controllers\Admin\AdminUserController;
use App\Http\Controllers\ContactCategoryController;
use App\Http\Controllers\Admin\AdminMasterController;
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
        Route::prefix('admin')->group(function(){
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
    
    
    Route::middleware([
            // 'user.has.organization:{parameter}', 
            // 'is.not.expired:{parameter}'
        ])->group(function () {
        // Log Activity

        //Dashboard
        Route::get('/dashboard/{organization}', [DashboardController::class, 'index'])->name('dashboard');
        //

        // Data Master 
        Route::prefix('data-master/{organization}')->group(function(){
            // Log
            Route::get('/logs', LogController::class)->name('logs');

            Route::get('/', DataMasterController::class)->name('data-master');

            // Contact
            Route::get('/contacts', [ContactController::class, 'index'])->name('contact');

            // Contact Category
            Route::get('/contact-categories', [ContactCategoryController::class, 'index'])->name('contact-category');
            Route::post('/contact-categories', [ContactCategoryController::class, 'store'])->name('contact-category.post')->middleware('is.not.viewer');
            Route::patch('/contact-categories/{contactCategory}', [ContactCategoryController::class, 'update'])->name('contact-category.update')->middleware('is.not.viewer');
            Route::delete('/contact-categories/{contactCategory}', [ContactCategoryController::class, 'destroy'])->name('contact-category.destroy')->middleware('is.not.viewer');            
        });
    });

});

Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});

require __DIR__.'/auth.php';
