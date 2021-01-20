"""games table

Revision ID: ef2aef5e0c0d
Revises: 
Create Date: 2021-01-20 16:44:00.492841

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = 'ef2aef5e0c0d'
down_revision = None
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.create_table('game',
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('game_id', sa.String(length=64), nullable=True),
    sa.Column('fields', sa.String(length=64), nullable=True),
    sa.Column('player', sa.String(length=64), nullable=True),
    sa.PrimaryKeyConstraint('id')
    )
    op.create_index(op.f('ix_game_fields'), 'game', ['fields'], unique=False)
    op.create_index(op.f('ix_game_game_id'), 'game', ['game_id'], unique=False)
    op.create_index(op.f('ix_game_player'), 'game', ['player'], unique=False)
    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.drop_index(op.f('ix_game_player'), table_name='game')
    op.drop_index(op.f('ix_game_game_id'), table_name='game')
    op.drop_index(op.f('ix_game_fields'), table_name='game')
    op.drop_table('game')
    # ### end Alembic commands ###