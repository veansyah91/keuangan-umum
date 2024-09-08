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
        Schema::create('student_entry_receivable_ledgers', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('receivable_id');
            $table->foreign('receivable_id')->references('id')->on('student_entry_receivables');
            $table->unsignedBigInteger('created_by_id')->nullable();
            $table->foreign('created_by_id')->references('id')->on('users');

            $table->unsignedBigInteger('payment_id')->nullable();
            $table->foreign('payment_id')->references('id')->on('student_entry_payments');

            $table->foreignId('journal_id')->constrained()->cascadeOnDelete();

            $table->bigInteger('debit')->default(0);
            $table->bigInteger('credit')->default(0);
            
            $table->string('no_ref');
            $table->string('description');
            $table->date('date');
            $table->string('study_year');
            $table->date('paid_date')->nullable();

            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('student_entry_receivable_ledgers');
    }
};
