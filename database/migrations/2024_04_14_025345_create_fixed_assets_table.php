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
        Schema::create('fixed_assets', function (Blueprint $table) {
            $table->id();
            $table->foreignUuid('organization_id')->constrained()->cascadeOnDelete();

            $table->unsignedBigInteger('user_id');
            $table->foreign('user_id')->references('id')->on('users');

            $table->unsignedBigInteger('fixed_asset_category_id');
            $table->foreign('fixed_asset_category_id')->references('id')->on('fixed_asset_categories');

            $table->unsignedBigInteger('asset');
            $table->foreign('asset')->references('id')->on('accounts');

            $table->unsignedBigInteger('accumulated_depreciation')->nullable();
            $table->foreign('accumulated_depreciation')->references('id')->on('accounts');

            $table->unsignedBigInteger('depreciation')->nullable();
            $table->foreign('depreciation')->references('id')->on('accounts');

            $table->unsignedBigInteger('credit_account')->nullable();
            $table->foreign('credit_account')->references('id')->on('accounts');

            $table->integer('lifetime')->default(0); //dalam bulan
            $table->string('name');
            $table->string('code');
            $table->bigInteger('residue')->default(0);
            $table->bigInteger('value')->default(0);
            $table->bigInteger('depreciation_value')->default(0);
            $table->bigInteger('depreciation_accumulated')->default(0);
            $table->boolean('status')->default(true);
            $table->date('date');

            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('fixed_assets');
    }
};
