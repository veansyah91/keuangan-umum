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
            $table->unsignedBigInteger('revenue_student');
            $table->foreign('revenue_student')->references('id')->on('accounts');

            // akun piutang pembayaran iuran bulanan sekolah
            $table->unsignedBigInteger('receivable_monthly_student');
            $table->foreign('receivable_monthly_student')->references('id')->on('accounts');

            // akun piutang pembayaran iuran bulanan sekolah
            $table->unsignedBigInteger('receivable_entry_student');
            $table->foreign('receivable_entry_student')->references('id')->on('accounts');

            // akun pembayaran di muka iuran bulanan sekolah
            $table->unsignedBigInteger('prepaid_student');
            $table->foreign('prepaid_student')->references('id')->on('accounts');

            // akun pembayaran uang masuk sekolah
            $table->unsignedBigInteger('entry_student');
            $table->foreign('entry_student')->references('id')->on('accounts');

            // akun pembayaran gaji
            $table->unsignedBigInteger('staff_salary_expense');
            $table->foreign('staff_salary_expense')->references('id')->on('accounts');

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
