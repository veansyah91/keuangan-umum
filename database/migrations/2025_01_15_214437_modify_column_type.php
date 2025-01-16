<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('school_account_settings', function (Blueprint $table) {
            $table->dropForeign(['staff_salary_expense']);

            $table->unsignedBigInteger('staff_salary_expense')->nullable()->change();
            
            $table->foreign('staff_salary_expense')->references('id')->on('accounts')->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('school_account_settings', function (Blueprint $table) {
             // Drop foreign key constraint terlebih dahulu
             $table->dropForeign(['staff_salary_expense']);
            
             // Ubah kolom menjadi non-nullable
             $table->unsignedBigInteger('staff_salary_expense')->nullable(false)->change();
             
             // Tambahkan kembali foreign key constraint
             $table->foreign('staff_salary_expense')->references('id')->on('accounts')->onDelete('cascade');
        });
    }
};
