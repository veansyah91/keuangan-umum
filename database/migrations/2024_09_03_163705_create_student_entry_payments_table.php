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
        Schema::create('student_entry_payments', function (Blueprint $table) {
            $table->id();
            $table->foreignUuid('organization_id')->constrained()->cascadeOnDelete();
            $table->unsignedBigInteger('contact_id');
            $table->foreign('contact_id')->references('id')->on('contacts');
            $table->unsignedBigInteger('created_by_id');
            $table->foreign('created_by_id')->references('id')->on('users');
            $table->unsignedBigInteger('journal_id');
            $table->foreign('journal_id')->references('id')->on('journals');
            
            $table->string('no_ref');
            $table->bigInteger('value')->default(0);
            $table->date('date');
            $table->string('study_year');

            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('student_entry_payments');
    }
};
