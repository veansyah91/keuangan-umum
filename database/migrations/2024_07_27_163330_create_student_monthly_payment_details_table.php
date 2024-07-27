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
        Schema::create('s_monthly_payment_details', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('payment_id'); // student_monthly_payment_id
            $table->foreign('payment_id')->references('id')->on('student_monthly_payments');
            $table->unsignedBigInteger('student_payment_category_id');
            $table->foreign('student_payment_category_id')->references('id')->on('student_payment_categories');
            $table->bigInteger('value')->default(0);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('student_monthly_payment_details');
    }
};
