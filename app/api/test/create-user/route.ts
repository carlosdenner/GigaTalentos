import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import { User } from '@/models';

export async function POST() {
  try {
    await connectDB();

    // Check if test user already exists
    let testUser = await User.findOne({ email: 'test@gigatalentos.com' });
    
    if (testUser) {
      return NextResponse.json({
        message: 'Test user already exists',
        user: {
          id: testUser._id,
          name: testUser.name,
          email: testUser.email
        }
      });
    }

    // Create test user for carousel/analytics functionality
    testUser = await User.create({
      name: 'Usuario Teste',
      email: 'test@gigatalentos.com',
      password: 'hashed_test_password',
      account_type: 'fan',
      user_type: 'fan',
      bio: 'Usuario de teste para funcionalidades do carousel e analytics',
      verified: true,
      created_at: new Date()
    });

    console.log('✅ Created test user:', testUser.name);

    return NextResponse.json({
      message: 'Test user created successfully',
      user: {
        id: testUser._id,
        name: testUser.name,
        email: testUser.email,
        account_type: testUser.account_type
      }
    });

  } catch (error) {
    console.error('Error creating test user:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json(
      { error: `Failed to create test user: ${errorMessage}` },
      { status: 500 }
    );
  }
}
