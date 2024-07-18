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
        Schema::create('school_account_settings', function (Blueprint $table) {
            $table->id();
            $table->foreignUuid('organization_id')->constrained()->cascadeOnDelete();

            // akun pendapatan pembayaran iuran bulanan sekolah (rv_)
            $table->unsignedBigInteger('revenue_student_account_id');
            $table->foreign('revenue_student_account_id')->references('id')->on('accounts');

            // akun piutang pembayaran iuran bulanan sekolah
            $table->unsignedBigInteger('receivable_student_account_id');
            $table->foreign('receivable_student_account_id')->references('id')->on('accounts');

            // akun pembayaran di muka iuran bulanan sekolah
            $table->unsignedBigInteger('prepaid_student_account_id');
            $table->foreign('prepaid_student_account_id')->references('id')->on('accounts');

            // akun pembayaran uang masuk sekolah
            $table->unsignedBigInteger('entry_student_account_id');
            $table->foreign('entry_student_account_id')->references('id')->on('accounts');

            // akun pembayaran gaji
            $table->unsignedBigInteger('staff_salary_expense_account_id');
            $table->foreign('staff_salary_expense_account_id')->references('id')->on('accounts');

            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('school_account_settings');
    }
};
